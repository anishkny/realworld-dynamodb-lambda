const assert = require('assert');
const axios = require('axios');
const TestUtil = require('./TestUtil');
const API_URL = process.env.API_URL;

// Root level 'before' function called at beginning of suite
before(async () => {

  console.log(`Testing API_URL: [${process.env.API_URL}]`);

  // Debounce if running against 'serverless offline'
  axios.interceptors.request.use(async (config) => {
    if (process.env.IS_OFFLINE) {
      process.stdout.write('.');
      await TestUtil.delay(100);
      process.stdout.write('\b');
    }
    return config;
  });
  process.stdout.write('Purging data... ');
  await axios.delete(`${API_URL}/__TESTUTILS__/purge`);
  console.log('Done!\n');
});

describe('Util', async () => {

  describe('Ping', async () => {

    it('should ping', async () => {
      const pong = await axios.get(`${API_URL}/ping`);
      ['pong', 'AWS_REGION', 'DYNAMODB_NAMESPACE'].forEach(k => {
        assert.equal(typeof pong.data[k], 'string',
          `Expected key not found: [${k}], ` +
          `Actual: [${JSON.stringify(pong.data)}]`);
      });
    });

  });

});
