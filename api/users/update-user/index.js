const config = require('../../../config');
const aws = require('aws-sdk');
aws.config.update({
  region: config.region || process.env.AWS_REGION || 'eu-west-1'
});
const dynamoDb = new aws.DynamoDB.DocumentClient();
const jwt = require('jsonwebtoken');
const computeHash = require('../../../lib/helpers').computeHash;

module.exports.respond = function (event, user, cb) {
  var data = event.body ? JSON.parse(event.body) : event;

  const validParameters = [
    'email', 
    'username',
    'password',
    'image',
    'bio'
  ];

  let expressionAttributeValues = {};
  let updateExpression = [];
  for (const key of Object.keys(data.user)) {
    if(validParameters.indexOf(key) !== -1) {
      expressionAttributeValues[`:${key}`] = data.user[key] ? data.user[key] : undefined;
      updateExpression.push(`${key} = :${key}`);
    }
  }

  var params = {
    TableName: 'usersTable',
    Key: {
      email: user
    },
    UpdateExpression: `set ${updateExpression}`,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'ALL_NEW'
  };

  dynamoDb.update(params, function (error, result) {
    if (error || !result.Item) {
      cb({ statusCode: 422, errors: { Error: ['validating user.', JSON.stringify(error)] } });
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
};
