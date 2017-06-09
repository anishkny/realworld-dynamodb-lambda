const config = require('../../../config');
const aws = require('aws-sdk');
aws.config.update({
  region: config.region || process.env.AWS_REGION || 'eu-west-1'
});
const dynamoDb = new aws.DynamoDB.DocumentClient();
const jwt = require('jsonwebtoken');
const { computeHash } = require('../../../lib/helpers');

module.exports.respond = function (email, cb) {
  var params = {
    TableName: 'usersTable',
    Key: {
      email: email
    }
  };

  dynamoDb.get(params, function (error, result) {
    if (error || !result.Item) {
      cb({ statusCode: 422, errors: { Error: ["validating user."] } });
      return;
    }

    cb(null, {
      user: {
        id: 'todo',
        token: jwt.sign({ email: result.Item.email }, config.JWT_SECRET),
        email: result.Item.email,
        username: result.Item.username,
        image: result.Item.image,
        bio: result.Item.bio,
      }
    });
  });
}
