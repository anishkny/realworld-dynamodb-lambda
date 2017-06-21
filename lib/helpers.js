const crypto = require('crypto');

module.exports.computeHash = (password, salt) => {
  var len = 128;
  var iterations = 4096;

  if (salt) {
    return crypto.pbkdf2Sync(password, salt, iterations, len, 'sha512').toString('base64');
  } else {
    let salt = crypto.randomBytes(len);
    salt = salt.toString('base64');

    return {hash: crypto.pbkdf2Sync(password, salt, iterations, len, 'sha512').toString('base64'), salt: salt};
  }
};
