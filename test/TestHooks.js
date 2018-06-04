const axios = require('axios');
const TestUtil = require('./TestUtil');
const API_URL = process.env.API_URL;

// Root level 'before' function called at beginning of suite
before(async () => {

  console.log(`Testing API_URL: [${API_URL}]`);
  axios.defaults.baseURL = API_URL;

  process.stdout.write('Purging data... ');
  await axios.delete(`/__TESTUTILS__/purge`);
  console.log('Done!\n');

  // Debounce if running against 'serverless offline'
  if (process.env.IS_OFFLINE) {
    axios.interceptors.request.use(async (config) => {
      process.stdout.write('.');
      await TestUtil.delay(100);
      process.stdout.write('\b');

      return config;
    });
  }

});
