const Util = require('./Util');
const usersTable = Util.getTableName('users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * @module User
 */
module.exports = {

  /** Create user */
  async create(event, context, callback) {
    const body = JSON.parse(event.body);

    if (!body.user) {
      Util.ERROR(callback, 'User must be specified.');
      return;
    }

    const newUser = body.user;
    if (!newUser.username) {
      Util.ERROR(callback, 'Username must be specified.');
      return;
    }
    if (!newUser.email) {
      Util.ERROR(callback, 'Email must be specified.');
      return;
    }
    if (!newUser.password) {
      Util.ERROR(callback, 'Password must be specified.');
      return;
    }

    // Verify username is not taken
    const userWithThisUsername = await getUserByUsername(newUser.username);
    if (userWithThisUsername.Item) {
      Util.ERROR(callback, `Username already taken: [${newUser.username}]`);
      return;
    }

    // Verify email is not taken
    const userWithThisEmail = await getUserByEmail(newUser.email);
    if (userWithThisEmail.Count !== 0) {
      Util.ERROR(callback, `Email already taken: [${newUser.email}]`);
      return;
    }

    // Add new entry to usersTable
    const encryptedPassword = bcrypt.hashSync(newUser.password, 5);
    await Util.DocumentClient.put({
      TableName: usersTable,
      Item: {
        username: newUser.username,
        email: newUser.email,
        password: encryptedPassword,
      },
    }).promise();

    Util.SUCCESS(callback, {
      user: {
        email: newUser.email,
        token: mintToken(newUser.username),
        username: newUser.username,
        bio: '',
        image: '',
      }
    });
  },

  /** Login user */
  async login(event, context, callback) {
    const body = JSON.parse(event.body);
    if (!body.user) {
      Util.ERROR(callback, 'User must be specified.');
      return;
    }
    const user = body.user;
    if (!user.email) {
      Util.ERROR(callback, 'Email must be specified.');
      return;
    }
    if (!user.password) {
      Util.ERROR(callback, 'Password must be specified.');
      return;
    }

    // Get user with this email
    const userWithThisEmail = await getUserByEmail(user.email);
    if (userWithThisEmail.Count !== 1) {
      Util.ERROR(callback, `Email not found: [${user.email}]`);
      return;
    }

    // Attempt to match password
    if (!bcrypt.compareSync(user.password,
        userWithThisEmail.Items[0].password)) {
      Util.ERROR(callback, 'Wrong password.');
      return;
    }

    const authenticatedUser = {
      email: user.email,
      token: mintToken(userWithThisEmail.Items[0].username),
      username: userWithThisEmail.Items[0].username,
      bio: userWithThisEmail.Items[0].bio || '',
      image: userWithThisEmail.Items[0].image || '',
    };
    Util.SUCCESS(callback, { user: authenticatedUser });
  },

  /** Get user */
  async get(event, context, callback) {
    const authenticatedUser = await authenticateAndGetUser(event);
    if (!authenticatedUser) {
      Util.ERROR(callback, 'Token not present or invalid.');
      return;
    }
    Util.SUCCESS(callback, {
      user: {
        email: authenticatedUser.email,
        token: getTokenFromEvent(event),
        username: authenticatedUser.username,
        bio: authenticatedUser.bio || '',
        image: authenticatedUser.image || '',
      }
    });
  },

  authenticateAndGetUser,
  getUserByUsername,

  async getProfile(event, context, callback) {
    const username = event.pathParameters.username;
    const authenticatedUser =
      await authenticateAndGetUser(event);
    const profile = await getProfileByUsername(username,
      authenticatedUser);
    if (!profile) {
      Util.ERROR(callback, `User not found: [${username}]`);
      return;
    }
    Util.SUCCESS(callback, { profile });
  },

  getProfileByUsername,

  async follow(event, context, callback) {
    const authenticatedUser = await authenticateAndGetUser(event);
    if (!authenticatedUser) {
      Util.ERROR(callback, 'Token not present or invalid.');
      return;
    }
    const username = event.pathParameters.username;
    const user = (await getUserByUsername(username)).Item;
    const shouldFollow = !(event.httpMethod === 'DELETE');

    // Update "followers" field on followed user
    if (shouldFollow) {
      if (user.followers &&
        !user.followers.values.includes(authenticatedUser.username)) {
        user.followers.values.push(authenticatedUser.username);
      } else {
        user.followers = Util.DocumentClient.createSet(
          [authenticatedUser.username]);
      }
    } else {
      // TODO: Implement unfollow logic
    }
    await Util.DocumentClient.put({
      TableName: usersTable,
      Item: user,
    }).promise();

    // Update "following" field on follower user
    if (shouldFollow) {
      if (authenticatedUser.following &&
        !authenticatedUser.following.values.includes(username)) {
        authenticatedUser.following.values.push(username);
      } else {
        authenticatedUser.following = Util.DocumentClient.createSet([username]);
      }
    } else {
      // TODO: Implement unfollow logic
    }
    await Util.DocumentClient.put({
      TableName: usersTable,
      Item: authenticatedUser,
    }).promise();

    const profile = {
      username,
      bio: user.bio || '',
      image: user.image || '',
      following: shouldFollow,
    };
    Util.SUCCESS(callback, { profile });
  },

  /** Create followed users */
  async getFollowedUsers(aUsername) {
    const user = (await Util.DocumentClient.get({
      TableName: usersTable,
      Key: {
        username: aUsername,
      },
    }).promise()).Item;
    return user.following ? user.following.values : [];
  },

};

function mintToken(aUsername) {
  return jwt.sign({ username: aUsername },
    Util.tokenSecret, { expiresIn: '2 days' });
}

function getUserByEmail(aEmail) {
  return Util.DocumentClient.query({
    TableName: usersTable,
    IndexName: 'email',
    KeyConditionExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': aEmail,
    },
    Select: 'ALL_ATTRIBUTES',
  }).promise();
}

function getUserByUsername(aUsername) {
  return Util.DocumentClient.get({
    TableName: usersTable,
    Key: {
      username: aUsername,
    },
  }).promise();
}

function getTokenFromEvent(event) {
  return event.headers.Authorization.replace('Token ', '');
}

async function getProfileByUsername(aUsername, aAuthenticatedUser) {
  const user = (await getUserByUsername(aUsername)).Item;
  if (!user) {
    return null;
  }

  const profile = {
    username: user.username,
    bio: user.bio || '',
    image: user.image || '',
    following: false,
  };

  // If user is authenticated, set following bit
  if (user.followers && aAuthenticatedUser) {
    profile.following = user.followers.values
      .includes(aAuthenticatedUser.username);
  }
  return profile;
}

async function authenticateAndGetUser(event) {
  try {
    const token = getTokenFromEvent(event);
    const decoded = jwt.verify(token, Util.tokenSecret);
    const username = decoded.username;
    const authenticatedUser = await getUserByUsername(username);
    return authenticatedUser.Item;
  } catch (err) {
    return null;
  }
}
