const Util = require('./Util');
const User = require('./User');
const articlesTable = Util.getTableName('articles');
const slugify = require('slugify');

/**
 * @module Article
 */
module.exports = {

  /** Create article */
  async create(event) {
    const authenticatedUser = await User.authenticateAndGetUser(event);
    if (!authenticatedUser) {
      return Util.envelop('Must be logged in.', 422);
    }

    const body = JSON.parse(event.body);
    if (!body.article) {
      return Util.envelop('Article must be specified.', 422);
    }
    const articleData = body.article;
    for (const expectedField of ['title', 'description', 'body']) {
      if (!articleData[expectedField]) {
        return Util.envelop(`${expectedField} must be specified.`, 422);
      }
    }

    const timestamp = (new Date()).getTime();
    const slug = slugify(articleData.title) + '-' +
      (Math.random() * Math.pow(36, 6) | 0).toString(36);
    const article = {
      slug,
      title: articleData.title,
      description: articleData.description,
      body: articleData.body,
      createdAt: timestamp,
      updatedAt: timestamp,
      author: authenticatedUser.username,
      dummy: 'OK',
    };
    if (articleData.tagList) {
      article.tagList = Util.DocumentClient.createSet(articleData.tagList);
    }

    await Util.DocumentClient.put({
      TableName: articlesTable,
      Item: article,
    }).promise();

    delete article.dummy;
    article.tagList = articleData.tagList || [];
    article.favorited = false;
    article.favoritesCount = 0;
    article.author = {
      username: authenticatedUser.username,
      bio: authenticatedUser.bio || '',
      image: authenticatedUser.image || '',
      following: false,
    };

    return Util.envelop({ article });
  },

  /** Get article */
  async get(event) {
    const slug = event.pathParameters.slug;

    /* istanbul ignore if  */
    if (!slug) {
      return Util.envelop('Slug must be specified.', 422);
    }

    const article = (await Util.DocumentClient.get({
      TableName: articlesTable,
      Key: { slug },
    }).promise()).Item;
    if (!article) {
      return Util.envelop(`Article not found: [${slug}]`, 422);
    }

    const authenticatedUser = await User.authenticateAndGetUser(event);
    return Util.envelop({
      article: await transformRetrievedArticle(article, authenticatedUser)
    });
  },

  /** Update article */
  async update(event) {
    const body = JSON.parse(event.body);
    const articleMutation = body.article;
    if (!articleMutation) {
      return Util.envelop('Article mutation must be specified.', 422);
    }

    // Ensure at least one mutation is requested
    if (!articleMutation.title &&
      !articleMutation.description && !articleMutation.body) {
      return Util.envelop(
        'At least one field must be specified: [title, description, article].',
        422);
    }

    const authenticatedUser = await User.authenticateAndGetUser(event);
    if (!authenticatedUser) {
      return Util.envelop('Must be logged in.', 422);
    }

    const slug = event.pathParameters.slug;

    /* istanbul ignore if  */
    if (!slug) {
      return Util.envelop('Slug must be specified.', 422);
    }

    const article = (await Util.DocumentClient.get({
      TableName: articlesTable,
      Key: { slug },
    }).promise()).Item;
    if (!article) {
      return Util.envelop(`Article not found: [${slug}]`, 422);
    }

    // Ensure article is authored by authenticatedUser
    if (article.author !== authenticatedUser.username) {
      return Util.envelop('Article can only be updated by author: ' +
        `[${article.author}]`, 422);
    }

    // Apply mutations to retrieved article
    ['title', 'description', 'body'].forEach(field => {
      if (articleMutation[field]) {
        article[field] = articleMutation[field];
      }
    });
    await Util.DocumentClient.put({
      TableName: articlesTable,
      Item: article,
    }).promise();

    const updatedArticle = (await Util.DocumentClient.get({
      TableName: articlesTable,
      Key: { slug },
    }).promise()).Item;

    return Util.envelop({
      article: await transformRetrievedArticle(
        updatedArticle, authenticatedUser),
    });
  },

  /** Delete article */
  async delete(event) {
    const authenticatedUser = await User.authenticateAndGetUser(event);
    if (!authenticatedUser) {
      return Util.envelop('Must be logged in.', 422);
    }

    const slug = event.pathParameters.slug;

    /* istanbul ignore if  */
    if (!slug) {
      return Util.envelop('Slug must be specified.', 422);
    }

    const article = (await Util.DocumentClient.get({
      TableName: articlesTable,
      Key: { slug },
    }).promise()).Item;
    if (!article) {
      return Util.envelop(`Article not found: [${slug}]`, 422);
    }

    // Ensure article is authored by authenticatedUser
    if (article.author !== authenticatedUser.username) {
      return Util.envelop('Article can only be deleted by author: ' +
        `[${article.author}]`, 422);
    }

    await Util.DocumentClient.delete({
      TableName: articlesTable,
      Key: { slug },
    }).promise();

    return Util.envelop({});
  },

  /** Favorite/unfavorite article */
  async favorite(event) {
    const authenticatedUser = await User.authenticateAndGetUser(event);
    if (!authenticatedUser) {
      return Util.envelop('Must be logged in.', 422);
    }

    const slug = event.pathParameters.slug;

    /* istanbul ignore if  */
    if (!slug) {
      return Util.envelop('Slug must be specified.', 422);
    }

    let article = (await Util.DocumentClient.get({
      TableName: articlesTable,
      Key: { slug },
    }).promise()).Item;
    if (!article) {
      return Util.envelop(`Article not found: [${slug}]`, 422);
    }

    // Set/unset favorite bit and count for article
    const shouldFavorite = !(event.httpMethod === 'DELETE');
    if (shouldFavorite) {
      /* istanbul ignore next */
      if (!article.favoritedBy) {
        article.favoritedBy = [];
      }
      article.favoritedBy.push(authenticatedUser.username);
      article.favoritesCount = 1;
    } else {
      article.favoritedBy = article.favoritedBy.filter(
        e => (e !== authenticatedUser.username));
      /* istanbul ignore next */
      if (article.favoritedBy.length === 0) {
        delete article.favoritedBy;
      }
    }
    article.favoritesCount = article.favoritedBy ?
      article.favoritedBy.length : 0;
    await Util.DocumentClient.put({
      TableName: articlesTable,
      Item: article,
    }).promise();

    article = await transformRetrievedArticle(article);
    article.favorited = shouldFavorite;
    return Util.envelop({ article });
  },

  /** List articles */
  async list(event) {
    const authenticatedUser = await User.authenticateAndGetUser(event);
    const params = event.queryStringParameters || {};
    const limit = parseInt(params.limit) || 20;
    const offset = parseInt(params.offset) || 0;
    if ((params.tag && params.author) ||
      (params.author && params.favorited) || (params.favorited && params.tag)) {
      return Util.envelop(
        'Only one of these can be specified: [tag, author, favorited]', 422);
    }
    const queryParams = {
      TableName: articlesTable,
      IndexName: 'updatedAt',
      KeyConditionExpression: 'dummy = :dummy',
      ExpressionAttributeValues: {
        ':dummy': 'OK',
      },
      ScanIndexForward: false,
    };
    if (params.tag) {
      queryParams.FilterExpression = 'contains(tagList, :tag)';
      queryParams.ExpressionAttributeValues[':tag'] = params.tag;
    } else if (params.author) {
      queryParams.FilterExpression = 'author = :author';
      queryParams.ExpressionAttributeValues[':author'] = params.author;
    } else if (params.favorited) {
      queryParams.FilterExpression = 'contains(favoritedBy, :favorited)';
      queryParams.ExpressionAttributeValues[':favorited'] = params.favorited;
    }
    return Util.envelop({
      articles: await queryEnoughArticles(queryParams, authenticatedUser,
        limit, offset)
    });
  },

  /** Get Articles feed */
  async getFeed(event) {
    const authenticatedUser = await User.authenticateAndGetUser(event);
    if (!authenticatedUser) {
      return Util.envelop('Must be logged in.', 422);
    }

    const params = event.queryStringParameters || {};
    const limit = parseInt(params.limit) || 20;
    const offset = parseInt(params.offset) || 0;

    // Get followed users
    const followed = await User.getFollowedUsers(authenticatedUser.username);
    if (!followed.length) {
      return Util.envelop({ articles: [] });
    }

    const queryParams = {
      TableName: articlesTable,
      IndexName: 'updatedAt',
      KeyConditionExpression: 'dummy = :dummy',
      FilterExpression: 'author IN ',
      ExpressionAttributeValues: {
        ':dummy': 'OK',
      },
      ScanIndexForward: false,
    };

    // Query articlesTable to filter only authored by followed users
    // This results in:
    //   FilterExpression:
    //      'author IN (:author0, author1, ...)',
    //   ExpressionAttributeValues:
    //      { ':dummy': 'OK', ':author0': 'authoress-kly3oz', ':author1': ... },
    for (let i = 0; i < followed.length; ++i) {
      queryParams.ExpressionAttributeValues[`:author${i}`] = followed[i];
    }
    queryParams.FilterExpression += '(' +
      Object.keys(queryParams.ExpressionAttributeValues)
      .filter(e => e !== ':dummy').join(",") +
      ')';
    console.log(`FilterExpression: [${queryParams.FilterExpression}]`);
    return Util.envelop({
      articles: await queryEnoughArticles(queryParams, authenticatedUser,
        limit, offset),
    });
  },

  /** Get list of tags */
  async getTags() {
    const uniqTags = {};

    let lastEvaluatedKey = null;
    do {
      const scanParams = {
        TableName: articlesTable,
        AttributesToGet: ['tagList'],
      };
      /* istanbul ignore next */
      if (lastEvaluatedKey) {
        scanParams.ExclusiveStartKey = lastEvaluatedKey;
      }
      const data = await Util.DocumentClient.scan(scanParams).promise();
      data.Items.forEach(item => {
        /* istanbul ignore next */
        if (item.tagList && item.tagList.values) {
          item.tagList.values.forEach(tag => uniqTags[tag] = 1);
        }
      });
      lastEvaluatedKey = data.LastEvaluatedKey;
    } while (lastEvaluatedKey);
    const tags = Object.keys(uniqTags);

    return Util.envelop({ tags });
  },

};

/**
 * Given queryParams, repeatedly call query until we have enough records
 * to satisfy (limit + offset)
 */
async function queryEnoughArticles(queryParams, authenticatedUser,
  limit, offset) {

  // Call query repeatedly, until we have enough records, or there are no more
  const queryResultItems = [];
  while (queryResultItems.length < (offset + limit)) {
    const queryResult = await Util.DocumentClient.query(queryParams)
      .promise();
    queryResultItems.push(...queryResult.Items);
    /* istanbul ignore next */
    if (queryResult.LastEvaluatedKey) {
      queryParams.ExclusiveStartKey = queryResult.LastEvaluatedKey;
    } else {
      break;
    }
  }

  // Decorate last "limit" number of articles with author data
  const articlePromises = [];
  queryResultItems.slice(offset, offset + limit).forEach(a =>
    articlePromises.push(transformRetrievedArticle(a, authenticatedUser)));
  const articles = await Promise.all(articlePromises);
  return articles;
}

/**
 * Given an article retrieved from table,
 * decorate it with extra information like author, favorite, following etc.
 */
async function transformRetrievedArticle(article, authenticatedUser) {
  delete article.dummy;
  article.tagList = article.tagList ? article.tagList.values : [];
  article.favoritesCount = article.favoritesCount || 0;
  article.favorited = false;
  if (article.favoritedBy && authenticatedUser) {
    article.favorited = article.favoritedBy
      .includes(authenticatedUser.username);
    delete article.favoritedBy;
  }
  article.author = await User.getProfileByUsername(article.author,
    authenticatedUser);
  return article;
}
