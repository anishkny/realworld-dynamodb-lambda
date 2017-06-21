const jwt = require('jsonwebtoken');
const config = require('../../../config');

module.exports.handler = function(event, context, cb) {
  const token = /Token (.*)/.exec(event.authorizationToken)[1];

  let decodedToken = '';
  try {
    decodedToken = jwt.verify(token, config.JWT_SECRET);
  } catch(e) {
    cb(new Error('Unauthorized'));
    return; 
  }

  // TODO: Do we need to validate if user have access to requested resource?
  const status = 'allow';

  switch (status) {
    case 'allow':
      cb(null, generatePolicy(decodedToken.email, 'Allow', event.methodArn));
      break;
    case 'deny':
      cb(null, generatePolicy(decodedToken.email, 'Deny', event.methodArn));
      break;
    case 'unauthorized':
      cb(new Error('Unauthorized'));
      break;
    default:
      cb(new Error('error'));
  }
};

function generatePolicy(principalId, effect, resource) {
  const authResponse = {};
  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    const statementOne = {};
    statementOne.Action = 'execute-api:Invoke';
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }

  return authResponse;
}