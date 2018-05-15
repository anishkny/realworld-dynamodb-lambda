const Util = require('./Util');
const User = require('./User');
const articlesTable = Util.getTableName('articles');
const slugify = require('slugify');

/**
 * @module Article
 */
module.exports = {

  /** Create article */
  async create(event, context, callback) {
    const authenticatedUser = await User.authenticateAndGetUser(event);
    if (!authenticatedUser) {
      Util.ERROR(callback, 'Must be logged in.');
      return;
    }

    const body = JSON.parse(event.body);
    if (!body.article) {
      Util.ERROR(callback, 'Article must be specified.');
      return;
    }
    const articleData = body.article;
    for (const expectedField of ['title', 'description', 'body']) {
      if (!articleData[expectedField]) {
        Util.ERROR(callback, `${expectedField} must be specified.`);
        return;
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

    Util.SUCCESS(callback, { article });
  },

  /** Get article */
  async get(event, context, callback) {
    const slug = event.pathParameters.slug;

    /* istanbul ignore if  */
    if (!slug) {
      Util.ERROR('Slug must be specified.');
      return;
    }

    const article = (await Util.DocumentClient.get({
      TableName: articlesTable,
      Key: { slug },
    }).promise()).Item;
    if (!article) {
      Util.ERROR(callback, `Article not found: [${slug}]`);
      return;
    }

    const authenticatedUser = await User.authenticateAndGetUser(event);
    Util.SUCCESS(callback, {
      article: await transformRetrievedArticle(article, authenticatedUser)
    });
  },

  /** Delete article */
  async delete(event, context, callback) {
    const authenticatedUser = await User.authenticateAndGetUser(event);
    if (!authenticatedUser) {
      Util.ERROR(callback, 'Must be logged in.');
      return;
    }

    const slug = event.pathParameters.slug;

    /* istanbul ignore if  */
    if (!slug) {
      Util.ERROR('Slug must be specified.');
      return;
    }

    const article = (await Util.DocumentClient.get({
      TableName: articlesTable,
      Key: { slug },
    }).promise()).Item;
    if (!article) {
      Util.ERROR(callback, `Article not found: [${slug}]`);
      return;
    }

    // Ensure article is authored by authenticatedUser
    if (article.author !== authenticatedUser.username) {
      Util.ERROR(callback,
        `Article can only be deleted by author: [${article.author}]`);
      return;
    }

    await Util.DocumentClient.delete({
      TableName: articlesTable,
      Key: { slug },
    }).promise();

    Util.SUCCESS(callback, null);
    return;
  },

  /** Favorite/unfavorite article */
  async favorite(event, context, callback) {
    const authenticatedUser = await User.authenticateAndGetUser(event);
    if (!authenticatedUser) {
      Util.ERROR(callback, 'Must be logged in.');
      return;
    }

    const slug = event.pathParameters.slug;

    /* istanbul ignore if  */
    if (!slug) {
      Util.ERROR('Slug must be specified.');
      return;
    }

    let article = (await Util.DocumentClient.get({
      TableName: articlesTable,
      Key: { slug },
    }).promise()).Item;
    if (!article) {
      Util.ERROR(callback, `Article not found: [${slug}]`);
      return;
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
    Util.SUCCESS(callback, { article });
  },

  /** List articles */
  async list(event, context, callback) {
    const authenticatedUser = await User.authenticateAndGetUser(event);
    const params = event.queryStringParameters || {};
    const limit = parseInt(params.limit) || 20;
    const offset = parseInt(params.offset) || 0;
    if ((params.tag && params.author) ||
      (params.author && params.favorited) || (params.favorited && params.tag)) {
      Util.ERROR(callback,
        'Only one of these can be specified: [tag, author, favorited]');
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

    Util.SUCCESS(callback, {
      articles: await queryEnoughArticles(queryParams, authenticatedUser,
        limit, offset)
    });
  },

  /** Get Articles feed */
  async getFeed(event, context, callback) {
    const authenticatedUser = await User.authenticateAndGetUser(event);
    if (!authenticatedUser) {
      Util.ERROR(callback, 'Must be logged in.');
      return;
    }

    const params = event.queryStringParameters || {};
    const limit = parseInt(params.limit) || 20;
    const offset = parseInt(params.offset) || 0;

    // Get followed users
    const followed = await User.getFollowedUsers(authenticatedUser.username);
    if (!followed.length) {
      Util.SUCCESS(callback, { articles: [] });
      return;
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

    Util.SUCCESS(callback, {
      articles: await queryEnoughArticles(queryParams, authenticatedUser,
        limit, offset),
    });
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
