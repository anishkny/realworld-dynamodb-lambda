const login = require('./index');

test('register fails - empty credentials', done => {
  let callback = (data) => {
    expect(data.errors.User).toEqual(['is required.']);
    done();
  };

  login.respond({}, callback);
});

// TODO: Successful register (& remove test user afterwards)