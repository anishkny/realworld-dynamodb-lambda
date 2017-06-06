const aws = require('aws-sdk');
const dynamoDb = new aws.DynamoDB.DocumentClient();
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

    // TODO: Calculate & return CognitoIdentity token
    //       This requires setting up identity pool (via script or through AWS Console)
    if(hash === result.Item.password) {
      cb(null, {
        user: {
          id: 'todo',
          token: 'todo',
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
