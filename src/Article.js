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
    };
    if (articleData.tagList) {
      article.tagList = Util.DocumentClient.createSet(articleData.tagList);
    }

    await Util.DocumentClient.put({
      TableName: articlesTable,
      Item: article,
    }).promise();

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

    Util.SUCCESS(callback, {
      article: await transformRetrievedArticle(article)
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
      if (!article.favoritedBy) {
        article.favoritedBy = [];
      }
      article.favoritedBy.push(authenticatedUser.username);
      article.favoritesCount = 1;
    } else {
      article.favoritedBy = article.favoritedBy.filter(
        e => (e !== authenticatedUser.username));
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

};

/**
 * Given an article retrieved from table,
 * decorate it with extra information like author, favorite, following etc.
 */
async function transformRetrievedArticle(article, authenticatedUser) {
  article.tagList = article.tagList ? article.tagList.values : [];
  article.favoritesCount = article.favoritesCount || 0;
  article.favorited = false;
  if (article.favoritedBy && authenticatedUser) {
    article.favorited = article.favoritedBy
      .includes(authenticatedUser.username);
    delete article.favoritedBy;
  }
  const authorUser = (await User.getUserByUsername(article.author)).Item;
  article.author = {
    username: authorUser.username,
    bio: authorUser.bio || '',
    image: authorUser.image || '',
    following: false,
  };
  if (authenticatedUser && authorUser.followers) {
    article.author.following =
      authorUser.followers.includes(authenticatedUser.username);
  }
  return article;
}
