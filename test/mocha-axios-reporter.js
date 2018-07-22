const mocha = require('mocha');
const axios = require('axios');
const fs = require('fs');
const NETWORK_DUMP_FILE = process.env.NETWORK_DUMP_FILE;

module.exports = MochaAxiosReporter;
let indent = 0; // eslint-disable-line no-unused-vars

function MochaAxiosReporter(runner) {
  mocha.reporters.Spec.call(this, runner);

  if (NETWORK_DUMP_FILE) {

    axios.interceptors.request.use(async (config) => {
      let reqDump = '```\n' + `${config.method.toUpperCase()} ${config.url}\n`;
      if (config.data) {
        reqDump += '\n' + JSON.stringify(config.data, null, 2) + '\n';
      }
      reqDump += '```\n';
      fs.appendFileSync(NETWORK_DUMP_FILE, reqDump);

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
      if (error && error.response && error.response.status &&
        error.response.statusText) {
        const resDump = '```\n' +
          `${error.response.status} ${error.response.statusText}\n\n` +
          JSON.stringify(error.response.data, null, 2) + '\n' +
          '```\n';
        fs.appendFileSync(NETWORK_DUMP_FILE, resDump);
      }
      return Promise.reject(error);
    });

    runner.on('suite', suite => {
      if (!suite || !suite.title) {
        return;
      }
      ++indent;
      fs.appendFileSync(NETWORK_DUMP_FILE,
        `${"#".repeat(indent)} ${suite.title}\n`);
    });

    runner.on('test', test => {
      ++indent;
      fs.appendFileSync(NETWORK_DUMP_FILE,
        `${"#".repeat(indent)} ${test.title}\n`);
    });

    runner.on('test end', () => {
      --indent;
    });

    runner.on('suite end', (suite) => {
      if (!suite || !suite.title) {
        return;
      }
      --indent;
    });

  }

}

mocha.utils.inherits(MochaAxiosReporter, mocha.reporters.Spec);
