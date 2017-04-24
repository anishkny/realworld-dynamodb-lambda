const aws = require('aws-sdk');
const dynamoDb = new aws.DynamoDB.DocumentClient();

module.exports.login = function (event, context, callback) {
  var data = {};
  if (event.body) {
    data = JSON.parse(event.body);
  } else {
    data = event;
  }

  if (!data.user) {
    callback(null, { statusCode: 422, body: JSON.stringify({ "errors": { "body": ["User is required."] } }) });
    return;
  }

  var email = data.user.email;
  var password = data.user.password;
  if (!email || !password) {
    callback(null, { statusCode: 422, body: JSON.stringify({ "errors": { "body": ["Email and password are required."] } }) });
    return;
  }

  var params = {
    TableName: 'usersTable',
    Key: {
      email: email,
    },
  };

  // fetch user from the database and validate
  dynamoDb.get(params, function (error, result) {
    if (error) {
      console.error(error);
      callback(null, { statusCode: 422, body: JSON.stringify({ "errors": { "body": ["Error validating user."] } }) });
      return;
    }

    if (result.Item.password === password) {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          user: {
            id: 'todo',
            token: 'todo',
            email: result.Item.email,
            username: result.Item.username,
            image: result.Item.image,
            bio: result.Item.bio,
          }
        }),
      });
    } else {
      callback(null, { statusCode: 422, body: JSON.stringify({ "errors": { "body": ["Wrong password."] } }) });
    }
  });
}
