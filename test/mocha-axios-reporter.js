const mocha = require('mocha');
const fs = require('fs');
const NETWORK_DUMP_FILE = process.env.NETWORK_DUMP_FILE;

module.exports = MochaAxiosReporter;
let indent = 1; // eslint-disable-line no-unused-vars

function MochaAxiosReporter(runner) {
  mocha.reporters.Spec.call(this, runner);

  if (NETWORK_DUMP_FILE) {
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
