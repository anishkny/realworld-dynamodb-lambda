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
    callback(new Error('[422] User is required.'));
    return;
  }

  var email = data.user.email;
  var password = data.user.password;
  if (!email || !password) {
    callback(new Error('[422] Email and password are required.'));
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
    // handle potential errors
    if (error) {
      console.error(error);
      callback(new Error('[422] Error vlaidating user.'));
      return;
    }

    console.log('result = [' + JSON.stringify(result) + '], password = [' + password + ']');

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
      callback(new Error('[422] Wrong password.'));
    }
  });
}
