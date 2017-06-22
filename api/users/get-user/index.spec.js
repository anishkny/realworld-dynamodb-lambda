const profile = require('./index');

test.skip('fetch profile data for test user', done => {
  let callback = (error, data) => {
    expect(data.user.email).toEqual('john@jacob.com');
    done();
  };

  profile.respond('john@jacob.com', callback);
});
