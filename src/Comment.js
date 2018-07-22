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
  async create(event) {
    const authenticatedUser = await User.authenticateAndGetUser(event);
    if (!authenticatedUser) {
      return Util.envelop('Must be logged in.', 422);
    }

    const body = JSON.parse(event.body);
    if (!body.comment || !body.comment.body) {
      return Util.envelop('Comment must be specified.', 422);
    }
    const commentBody = body.comment.body;

    const slug = event.pathParameters.slug;
    const article = (await Util.DocumentClient.get({
      TableName: articlesTable,
      Key: { slug },
    }).promise()).Item;
    if (!article) {
      return Util.envelop(`Article not found: [${slug}]`, 422);
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

    return Util.envelop({ comment });
  },

  /** Get comments for an article */
  async get(event) {
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

    return Util.envelop({ comments });
  },

  /** Delete comment */
  async delete(event) {
    const authenticatedUser = await User.authenticateAndGetUser(event);
    if (!authenticatedUser) {
      return Util.envelop('Must be logged in.', 422);
    }
    const commentId = event.pathParameters.id;

    const comment = (await Util.DocumentClient.get({
      TableName: commentsTable,
      Key: {
        id: commentId,
      },
    }).promise()).Item;
    if (!comment) {
      return Util.envelop(`Comment ID not found: [${commentId}]`, 422);
    }

    // Only comment author can delete comment
    if (comment.author !== authenticatedUser.username) {
      return Util.envelop(
        `Only comment author can delete: [${comment.author}]`, 422);
    }

    await Util.DocumentClient.delete({
      TableName: commentsTable,
      Key: {
        id: commentId,
      },
    }).promise();

    return Util.envelop({});
  },

};
