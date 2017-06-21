const login = require('./index');

test('user login fails - empty credentials', done => {
  let callback = (data) => {
    expect(data.errors.User).toEqual(['is required.']);
    done();
  };

  login.respond({}, callback);
});

test('user login fails - wrong credentials', done => {
  let callback = (data) => {
    expect(data.errors.Error).toEqual(['validating user.']);
    done();
  };

  login.respond({body: JSON.stringify({ user: {email: 'foo@bar.com', password: 'baz' }})}, callback);
});

test('user login successful', done => {
  let callback = (error, data) => {
    expect(data.user.email).toBe('john@jacob.com');
    done();
  };

  login.respond({body: JSON.stringify({ user: {email: 'john@jacob.com', password: 'johnnyjacob' }})}, callback);
});
