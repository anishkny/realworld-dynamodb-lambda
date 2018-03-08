require('babel-polyfill');
const Util = require('./Util');
const User = require('./User');
const articlesTable = Util.getTableName('articles');
const slugify = require('slugify');

module.exports = {

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

  async get(event, context, callback) {
    const slug = event.pathParameters.slug;
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

    article.tagList = article.tagList ? article.tagList.values : [];
    article.favoritesCount = article.favoritesCount || 0;

    // If user is authenticated, populate favorited field
    article.favorited = false;
    let authenticatedUser = null;
    if (article.favoritedBy) {
      authenticatedUser = await User.authenticateAndGetUser(event);
      if (authenticatedUser) {
        article.favorited = article.favoritedBy
          .includes(authenticatedUser.username);
      }
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

    Util.SUCCESS(callback, { article });
  },

};
