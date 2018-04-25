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


};
