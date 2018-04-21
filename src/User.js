const Util = require('./Util');
const usersTable = Util.getTableName('users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {

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

  async get(event, context, callback) {
    const authenticatedUser = await asyncHelpers.authenticateAndGetUser(event);
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

  async authenticateAndGetUser(event) {
    return await asyncHelpers.authenticateAndGetUser(event);
  },

  getUserByUsername,

  async getProfile(event, context, callback) {
    const username = event.pathParameters.username;
    const user = (await getUserByUsername(username)).Item;
    if (!user) {
      Util.ERROR(callback, `User not found: [${username}]`);
      return;
    }
    const profile = {
      username: user.username,
      bio: user.bio || '',
      image: user.image || '',
      following: false,
    };

    // If user is authenticated, set following bit
    if (user.followers) {
      const authenticatedUser =
        await asyncHelpers.authenticateAndGetUser(event);
      if (authenticatedUser) {
        profile.following = user.followers.values
          .includes(authenticatedUser.username);
      }
    }

    Util.SUCCESS(callback, { profile });
  },

  async follow(event, context, callback) {
    const authenticatedUser = await asyncHelpers.authenticateAndGetUser(event);
    if (!authenticatedUser) {
      Util.ERROR(callback, 'Token not present or invalid.');
      return;
    }
    const username = event.pathParameters.username;
    const user = (await getUserByUsername(username)).Item;
    const shouldFollow = !(event.httpMethod === 'DELETE');
    if (shouldFollow) {
      if (user.followers &&
        !user.followers.values.includes(authenticatedUser.username)) {
        user.followers.values.push(authenticatedUser.username);
      } else {
        user.followers = Util.DocumentClient.createSet(
          [authenticatedUser.username]);
      }
    }
    await Util.DocumentClient.put({
      TableName: usersTable,
      Item: user,
    }).promise();
    const profile = {
      username,
      bio: user.bio || '',
      image: user.image || '',
      following: shouldFollow,
    };
    Util.SUCCESS(callback, { profile });
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

const asyncHelpers = {

  async authenticateAndGetUser(event) {
    try {
      const token = getTokenFromEvent(event);
      const decoded = jwt.verify(token, Util.tokenSecret);
      const username = decoded.username;
      const authenticatedUser = await getUserByUsername(username);
      return authenticatedUser.Item;
    } catch (err) {
      return null;
    }
  },

};
