'use strict';

module.exports.ping = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      event: event,
    }, null, 2) + "\n",
  };

  callback(null, response);
};
