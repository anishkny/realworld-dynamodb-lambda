const axios = require('axios');
const fs = require('fs');
const TestUtil = require('./TestUtil');
const API_URL = process.env.API_URL;
const NETWORK_DUMP_FILE = process.env.NETWORK_DUMP_FILE;

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

  if (NETWORK_DUMP_FILE) {

    axios.interceptors.request.use(async (config) => {
      if (config.data) {
        const reqDump = '```\n' +
          `${config.method.toUpperCase()} ${config.url}\n\n` +
          JSON.stringify(config.data, null, 2) + '\n' +
          '```\n';
        fs.appendFileSync(NETWORK_DUMP_FILE, reqDump);
      }

      return config;
    });

    axios.interceptors.response.use(async (response) => {
      const resDump = '```\n' +
        `${response.status} ${response.statusText}\n\n` +
        JSON.stringify(response.data, null, 2) + '\n' +
        '```\n';
      fs.appendFileSync(NETWORK_DUMP_FILE, resDump);
      return response;
    }, async (error) => {
      const resDump = '```\n' +
        `${error.response.status} ${error.response.statusText}\n\n` +
        JSON.stringify(error.response.data, null, 2) + '\n' +
        '```\n';
      fs.appendFileSync(NETWORK_DUMP_FILE, resDump);
      return Promise.reject(error);
    });

  }

});
