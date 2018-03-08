const assert = require('assert');

module.exports = {

  assertError(res, errorRegex) {
    assert.equal(res.response.status, 422);
    const actualError = res.response.data.errors.body[0];
    assert(errorRegex.test(actualError),
      `Expected: [${errorRegex}], Actual: [${actualError}]`);
  },

  delay,

};

function delay(time) {
  return new Promise((fulfill) => setTimeout(fulfill, time));
}
