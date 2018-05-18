const assert = require('assert');
const axios = require('axios');

describe('Util', async () => {

  describe('Ping', async () => {

    it('should ping', async () => {
      const pong = await axios.get(`/ping`);
      ['pong', 'AWS_REGION', 'DYNAMODB_NAMESPACE'].forEach(k => {
        assert.equal(typeof pong.data[k], 'string',
          `Expected key not found: [${k}], ` +
          `Actual: [${JSON.stringify(pong.data)}]`);
      });

      // Verify CORS headers
      [
        ['access-control-allow-origin', '*'],
        ['access-control-allow-credentials', 'true'],
      ].forEach(pair => {
        assert.equal(pong.headers[pair[0]], pair[1],
          `Expected header not found: [${pair[0]}]=[${pair[1]}]`
        );
      });
    });

  });

});
