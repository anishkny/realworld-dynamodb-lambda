var index = require('./index');

module.exports.handler = function(event, context, cb) {

  index.respond(event, (error, success) => {
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
