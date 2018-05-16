/* istanbul ignore next */
if (!process.env.AWS_REGION) {
  process.env.AWS_REGION = 'us-east-1';
}

/* istanbul ignore next */
if (!process.env.DYNAMODB_NAMESPACE) {
  process.env.DYNAMODB_NAMESPACE = 'dev';
}

const AWS = require('aws-sdk');

// In offline mode, use DynamoDB local server
let DocumentClient = null;
/* istanbul ignore next */
if (process.env.IS_OFFLINE) {
  AWS.config.update({
    region: 'localhost',
    endpoint: "http://localhost:8000"
  });
}
DocumentClient = new AWS.DynamoDB.DocumentClient();


module.exports = {

  ping(event, context, callback) {
    SUCCESS(callback, {
      pong: new Date(),
      AWS_REGION: process.env.AWS_REGION,
      DYNAMODB_NAMESPACE: process.env.DYNAMODB_NAMESPACE,
    });
  },

  async purgeData(event, context, callback) {
    await asyncHelpers.purgeTable('users', 'username');
    await asyncHelpers.purgeTable('articles', 'slug');
    await asyncHelpers.purgeTable('comments', 'id');
    SUCCESS(callback, 'Purged all data!');
  },

  getTableName(aName) {
    return `realworld-${process.env.DYNAMODB_NAMESPACE}-${aName}`;
  },

  tokenSecret: /* istanbul ignore next */ process.env.SECRET ?
    process.env.SECRET : '3ee058420bc2',
  DocumentClient,
  RESPOND,
  SUCCESS,
  ERROR,

};

function RESPOND(statusCode, bodyObject, callback) {
  callback(null, {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(bodyObject),
  });
}

function SUCCESS(callback, object) {
  RESPOND(200, object, callback);
}

function ERROR(callback, err) {
  RESPOND(422, { errors: { body: [err] } }, callback);
}

const asyncHelpers = {

  async purgeTable(aTable, aKeyName) /* istanbul ignore next */ {
    const tableName = module.exports.getTableName(aTable);

    if (!tableName.includes('dev') && !tableName.includes('test')) {
      console.log(`WARNING: Table name [${tableName}] ` +
        `contains neither dev nor test, not purging`);
      return;
    }

    const allRecords = await DocumentClient
      .scan({ TableName: tableName }).promise();
    const deletePromises = [];
    for (let i = 0; i < allRecords.Items.length; ++i) {
      const recordToDelete = {
        TableName: tableName,
        Key: {},
      };
      recordToDelete.Key[aKeyName] = allRecords.Items[i][aKeyName];
      deletePromises.push(DocumentClient.delete(recordToDelete).promise());
    }
    await Promise.all(deletePromises);
  },

};
