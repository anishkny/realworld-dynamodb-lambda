const TestUtil = require('./TestUtil');
const assert = require('assert');
const axios = require('axios');
const API_URL = process.env.API_URL;

const username = `user1-${Math.random().toString(36)}`;
const userToCreate = {
  email: `${username}@email.com`,
  username: username,
  password: 'password',
};
let loggedInUser = null;

describe('User', async () => {

  describe('Create', async () => {

    it('should create user', async () => {
      const createdUser = (await axios.post(
        `${API_URL}/users`, { user: userToCreate })).data.user;
      assertUserEquals(createdUser, userToCreate);
    });

    it('should disallow same username', async () => {
      await axios.post(
        `${API_URL}/users`, { user: userToCreate }).catch(res => {
        assert.equal(res.response.status, 422);
        assert(/Username already taken/.test(res.response.data.errors.body[0]));
      });
    });

    it('should disallow same email', async () => {
      await axios.post(`${API_URL}/users`, {
        user: {
          username: 'user2',
          email: userToCreate.email,
          password: 'password',
        }
      }).catch(res => {
        assert.equal(res.response.status, 422);
        assert(/Email already taken/.test(res.response.data.errors.body[0]));
      });
    });

    it('should enforce required fields', async () => {
      await axios.post(`${API_URL}/users`, {})
        .catch(res => {
          TestUtil.assertError(res, /User must be specified/);
        });
      await axios.post(`${API_URL}/users`, {
        user: { foo: 1 }
      }).catch(res => {
        TestUtil.assertError(res, /Username must be specified/);
      });
      await axios.post(`${API_URL}/users`, {
        user: { username: 1 }
      }).catch(res => {
        TestUtil.assertError(res, /Email must be specified/);
      });
      await axios.post(`${API_URL}/users`, {
        user: { username: 1, email: 2 }
      }).catch(res => {
        TestUtil.assertError(res, /Password must be specified/);
      });
    });

  });

  describe('Login', async () => {

    it('should login', async () => {
      loggedInUser = (await axios.post(`${API_URL}/users/login`, {
        user: { email: userToCreate.email, password: userToCreate.password }
      })).data.user;
      assertUserEquals(loggedInUser, userToCreate);
    });

    it('should disallow unknown email', async () => {
      await axios.post(`${API_URL}/users/login`, {
        user: { email: Math.random().toString(36), password: 'somepassword' }
      }).catch(res => {
        TestUtil.assertError(res, /Email not found/);
      });
    });

    it('should disallow wrong password', async () => {
      await axios.post(`${API_URL}/users/login`, {
        user: {
          email: userToCreate.email,
          password: Math.random().toString(36)
        }
      }).catch(res => {
        TestUtil.assertError(res, /Wrong password/);
      });
    });

    it('should enforce required fields', async () => {
      await axios.post(`${API_URL}/users/login`, {}).catch(res => {
        TestUtil.assertError(res, /User must be specified/);
      });
      await axios.post(`${API_URL}/users/login`, { user: {} }).catch(res => {
        TestUtil.assertError(res, /Email must be specified/);
      });
      await axios.post(`${API_URL}/users/login`, {
        user: { email: 'someemail' }
      }).catch(res => {
        TestUtil.assertError(res, /Password must be specified/);
      });
    });

  });

  describe('Get', async () => {

    it('should get current user', async () => {
      const authenticatedUser = (await axios.get(`${API_URL}/user`, {
        headers: { 'Authorization': `Token ${loggedInUser.token}` }
      })).data.user;
      assertUserEquals(authenticatedUser, loggedInUser);
    });

    it('should disallow bad tokens', async () => {
      await axios.get(`${API_URL}/user`)
        .catch(res =>
          TestUtil.assertError(res, /Token not present or invalid/));
      await axios.get(`${API_URL}/user`, { headers: { foo: 'bar' } })
        .catch(res =>
          TestUtil.assertError(res, /Token not present or invalid/));
      await axios.get(`${API_URL}/user`, { headers: { Authorization: 'foo' } })
        .catch(res =>
          TestUtil.assertError(res, /Token not present or invalid/));
      await axios.get(`${API_URL}/user`, {
        headers: { Authorization: 'Token: foo' }
      }).catch(res =>
        TestUtil.assertError(res, /Token not present or invalid/));
    });

  });

  describe('Profile', async () => {

    it('should get profile', async () => {
      const profile = (await axios.get(
        `${API_URL}/profiles/${userToCreate.username}`)).data.profile;
      // TODO: Assert on profile
      (profile);
    });

    it('should disallow unknown username', async () => {
      await axios.get(`${API_URL}/profiles/foo_${Math.random().toString(36)}`)
        .catch(res => { TestUtil.assertError(res, /User not found/); });
    });

    // TODO: Add User.getProfile edge cases

    it('should follow user', async () => {

      // Create user who can be followed
      await axios.post(`${API_URL}/users`, {
        user: {
          username: 'followed_user',
          email: 'followed_user@mail.com',
          password: 'password',
        }
      });
      const followedProfile = (await axios({
        method: 'POST',
        url: `${API_URL}/profiles/followed_user/follow`,
        headers: { 'Authorization': `Token ${loggedInUser.token}` },
      })).data.profile;
      (followedProfile); // TODO: Assert on this

      // Following a user again should have no effect
      await axios({
        method: 'POST',
        url: `${API_URL}/profiles/followed_user/follow`,
        headers: { 'Authorization': `Token ${loggedInUser.token}` },
      });
      const retrievedFollowedProfile = (await axios({
        method: 'GET',
        url: `${API_URL}/profiles/followed_user`,
        headers: { 'Authorization': `Token ${loggedInUser.token}` },
      })).data.profile;
      console.log(retrievedFollowedProfile); // TODO: Assert on this

      // Create a second follower user
      const secondFollowerUsername = `user2-${Math.random().toString(36)}`;
      const secondFollowerUser = (await axios({
        method: 'POST',
        url: `${API_URL}/users`,
        data: {
          user: {
            username: secondFollowerUsername,
            email: `${secondFollowerUsername}@mail.com`,
            password: 'password',
          }
        },
      })).data.user;
      const secondFollowedProfile = (await axios({
        method: 'POST',
        url: `${API_URL}/profiles/followed_user/follow`,
        headers: { 'Authorization': `Token ${secondFollowerUser.token}` },
      })).data.profile;
      (secondFollowedProfile); // TODO: Assert on this
    });

    it('should unfollow user', async () => {
      const unfollowedProfile = (await axios({
        method: 'DELETE',
        url: `${API_URL}/profiles/followed_user/follow`,
        headers: { 'Authorization': `Token ${loggedInUser.token}` },
      })).data.profile;
      (unfollowedProfile);
    });

    it('should disallow following with bad token', async () => {
      await await axios({
        method: 'POST',
        url: `${API_URL}/profiles/followed_user/follow`,
      }).catch(res =>
        TestUtil.assertError(res, /Token not present or invalid/));
    });

  });

});

function assertUserEquals(actual, expected) {
  assert.equal(actual.username, expected.username);
  assert.equal(actual.email, expected.email);
  assert.equal(typeof actual.token, 'string');
  assert.equal(actual.bio, expected.bio || '');
  assert.equal(actual.image, expected.image || '');
}
