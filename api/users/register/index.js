const aws = require('aws-sdk');
const dynamoDb = new aws.DynamoDB.DocumentClient();
const computeHash = require('../../../lib/helpers').computeHash;

module.exports.respond = function (event, cb) {
  var data = event.body ? JSON.parse(event.body) : event;

  if (!data.user) {
    cb({ statusCode: 422, errors: { User: ['is required.'] } });
    return;
  }

  // TODO: Validate email format
  // TODO: Validate password requirements
  var email = data.user.email;
  var password = data.user.password;
  if (!email || !password) {
    cb({ statusCode: 422, errors: { 'Email and password': ['are required.'] } });
    return;
  }

  const hashedPassword = computeHash(password);

  var params = {
    TableName: 'usersTable',
    Item: {
      email: email,
      password: hashedPassword.hash,
      salt: hashedPassword.salt
    },
    ConditionExpression: 'attribute_not_exists (email)'
  };

  dynamoDb.put(params, function (error) {
    if (error) {
      console.error(error);
      cb({ statusCode: 422, errors: { Error: ['validating user.'] } });
      return;
    }

    cb(null, {
      created: true
    });
  });
};
