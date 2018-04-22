const Util = require('./Util');
const User = require('./User');

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
    //TODO: Create comment
    const comment = { foo: "bar" };
    Util.SUCCESS(callback, { comment });
  },


};
