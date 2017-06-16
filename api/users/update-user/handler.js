var index = require('./index');

module.exports.handler = function(event, context, cb) {
  const user = event.requestContext.authorizer.principalId;
  
  index.respond(event, user, (error, success) => {
    const response = {
      statusCode: (error && error.statusCode) ? error.statusCode : 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(success || { errors: error.errors })
    };

    cb(null, response);
  });
};
