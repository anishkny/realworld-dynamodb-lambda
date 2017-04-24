const aws = require('aws-sdk');
const dynamoDb = new aws.DynamoDB.DocumentClient();

module.exports.login = function (event, context, callback) {
  var data = {};
  if (event.body) {
    data = JSON.parse(event.body);
  } else {
    data = event;
  }

  var email = data.email;
  var password = data.password;
  if (!email || !password) {
    callback(null, { statusCode: 422, errors: { body: ["Email and password are required."] } });
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
      callback(null, { statusCode: 422, errors: { body: [error] } });
      return;
    }

    console.log('result = [' + JSON.stringify(result) + '], password = [' + password + ']');

    if (result.Item.password === password) {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          email: result.Item.email,
          username: result.Item.username,
          image: result.Item.image,
          bio: result.Item.bio,
        }),
      });
    } else {
      callback(null, { statusCode: 422, errors: { body: ["Wrong password."] } });
    }
  });
}
