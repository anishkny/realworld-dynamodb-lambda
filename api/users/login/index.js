const config = require('../../../config');
const aws = require('aws-sdk');
aws.config.update({
  region: config.region || process.env.AWS_REGION || 'eu-west-1'
});
const dynamoDb = new aws.DynamoDB.DocumentClient();
const jwt = require('jsonwebtoken');
const { computeHash } = require('../../../lib/helpers');

module.exports.respond = function (event, cb) {
  var data = event.body ? JSON.parse(event.body) : event;

  if (!data.user) {
    cb({ statusCode: 422, errors: { User: ["is required."] } });
    return;
  }

  var email = data.user.email;
  var password = data.user.password;
  if (!email || !password) {
    cb({ statusCode: 422, errors: { "Email and password": ["are required."] } });
    return;
  }

  var params = {
    TableName: 'usersTable',
    Key: {
      email: email,
    },
  };

  dynamoDb.get(params, function (error, result) {
    if (error || !result.Item) {
      cb({ statusCode: 422, errors: { Error: ["validating user."] } });
      return;
    }

    let hash = computeHash(password, result.Item.salt);

    if(hash === result.Item.password) {
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
    } else {
      cb({ statusCode: 422, errors: { '': ["Wrong password."] } });
    }
  });
}
