const Util = require('./Util');
const User = require('./User');
const articlesTable = Util.getTableName('articles');
const commentsTable = Util.getTableName('comments');
const uuidv4 = require('uuid/v4');

/**
 * @module Comment
 */
module.exports = {

  /** Create comment */
  async create(event, context, callback) {
    const authenticatedUser = await User.authenticateAndGetUser(event);
    if (!authenticatedUser) {
      Util.ERROR(callback, 'Must be logged in.');
      return;
    }

    const body = JSON.parse(event.body);
    if (!body.comment || !body.comment.body) {
      Util.ERROR(callback, 'Comment must be specified.');
      return;
    }
    const commentBody = body.comment.body;

    const slug = event.pathParameters.slug;
    const article = (await Util.DocumentClient.get({
      TableName: articlesTable,
      Key: { slug },
    }).promise()).Item;
    if (!article) {
      Util.ERROR(callback, `Article not found: [${slug}]`);
      return;
    }

    const timestamp = (new Date()).getTime();
    const comment = {
      id: uuidv4(),
      slug: slug,
      body: commentBody,
      createdAt: timestamp,
      updatedAt: timestamp,
      author: authenticatedUser.username,
    };

    await Util.DocumentClient.put({
      TableName: commentsTable,
      Item: comment,
    }).promise();

    comment.author = {
      username: authenticatedUser.username,
      bio: authenticatedUser.bio || '',
      image: authenticatedUser.image || '',
      following: false,
    };

    Util.SUCCESS(callback, { comment });
  },

  /** Get comments for an article */
  async get(event, context, callback) {
    const authenticatedUser = await User.authenticateAndGetUser(event);
    const slug = event.pathParameters.slug;

    const comments = (await Util.DocumentClient.query({
      TableName: commentsTable,
      IndexName: 'article',
      KeyConditionExpression: 'slug = :slug',
      ExpressionAttributeValues: {
        ':slug': slug,
      },
    }).promise()).Items;

    // Get profile for each comment's author
    for (let i = 0; i < comments.length; ++i) {
      comments[i].author = await User.getProfileByUsername(comments[i].author,
        authenticatedUser);
    }

    Util.SUCCESS(callback, { comments });
  },

  /** Delete comment */
  async delete(event, context, callback) {
    const authenticatedUser = await User.authenticateAndGetUser(event);
    if (!authenticatedUser) {
      Util.ERROR(callback, 'Must be logged in.');
      return;
    }
    const commentId = event.pathParameters.id;

    const comment = (await Util.DocumentClient.get({
      TableName: commentsTable,
      Key: {
        id: commentId,
      },
    }).promise()).Item;
    if (!comment) {
      Util.ERROR(callback, `Comment ID not found: [${commentId}]`);
      return;
    }

    // Only comment author can delete comment
    if (comment.author !== authenticatedUser.username) {
      Util.ERROR(callback,
        `Only comment author can delete: [${comment.author}]`);
      return;
    }

    await Util.DocumentClient.delete({
      TableName: commentsTable,
      Key: {
        id: commentId,
      },
    }).promise();

    Util.SUCCESS(callback, null);
  },

};
