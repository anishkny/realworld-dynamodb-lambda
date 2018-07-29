const Util = require('./Util');
const usersTable = Util.getTableName('users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * @module User
 */
module.exports = {

  /** Create user */
  async create(event) {
    const body = JSON.parse(event.body);

    if (!body.user) {
      return Util.envelop('User must be specified.', 422);
    }
    const newUser = body.user;
    if (!newUser.username) {
      return Util.envelop('Username must be specified.', 422);
    }
    if (!newUser.email) {
      return Util.envelop('Email must be specified.', 422);
    }
    if (!newUser.password) {
      return Util.envelop('Password must be specified.', 422);
    }

    // Verify username is not taken
    const userWithThisUsername = await getUserByUsername(newUser.username);
    if (userWithThisUsername.Item) {
      return Util.envelop(`Username already taken: [${newUser.username}]`, 422);
    }

    // Verify email is not taken
    const userWithThisEmail = await getUserByEmail(newUser.email);
    if (userWithThisEmail.Count !== 0) {
      return Util.envelop(`Email already taken: [${newUser.email}]`, 422);
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

    return Util.envelop({
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
  async login(event) {
    const body = JSON.parse(event.body);
    if (!body.user) {
      return Util.envelop('User must be specified.', 422);
    }
    const user = body.user;
    if (!user.email) {
      return Util.envelop('Email must be specified.', 422);
    }
    if (!user.password) {
      return Util.envelop('Password must be specified.', 422);
    }

    // Get user with this email
    const userWithThisEmail = await getUserByEmail(user.email);
    if (userWithThisEmail.Count !== 1) {
      return Util.envelop(`Email not found: [${user.email}]`, 422);
    }

    // Attempt to match password
    if (!bcrypt.compareSync(user.password,
        userWithThisEmail.Items[0].password)) {
      return Util.envelop('Wrong password.', 422);
    }

    const authenticatedUser = {
      email: user.email,
      token: mintToken(userWithThisEmail.Items[0].username),
      username: userWithThisEmail.Items[0].username,
      bio: userWithThisEmail.Items[0].bio || '',
      image: userWithThisEmail.Items[0].image || '',
    };
    return Util.envelop({ user: authenticatedUser });
  },

  /** Get user */
  async get(event) {
    const authenticatedUser = await authenticateAndGetUser(event);
    if (!authenticatedUser) {
      return Util.envelop('Token not present or invalid.', 422);
    }
    return Util.envelop({
      user: {
        email: authenticatedUser.email,
        token: getTokenFromEvent(event),
        username: authenticatedUser.username,
        bio: authenticatedUser.bio || '',
        image: authenticatedUser.image || '',
      }
    });
  },

  /** Update user */
  async update(event) {
    const authenticatedUser = await authenticateAndGetUser(event);
    if (!authenticatedUser) {
      return Util.envelop('Token not present or invalid.', 422);
    }
    const body = JSON.parse(event.body);
    const user = body.user;
    if (!user) {
      return Util.envelop('User must be specified.', 422);
    }
    const updatedUser = {
      username: authenticatedUser.username,
    };
    if (user.email) {
      // Verify email is not taken
      const userWithThisEmail = await getUserByEmail(user.email);
      if (userWithThisEmail.Count !== 0) {
        return Util.envelop(`Email already taken: [${user.email}]`, 422);
      }
      updatedUser.email = user.email;
    }
    if (user.password) {
      updatedUser.password = bcrypt.hashSync(user.password, 5);
    }
    if (user.image) {
      updatedUser.image = user.image;
    }
    if (user.bio) {
      updatedUser.bio = user.bio;
    }

    await Util.DocumentClient.put({
      TableName: usersTable,
      Item: updatedUser,
    }).promise();

    // Decorate updatedUser and return it
    if (updatedUser.password) {
      delete updatedUser.password;
    }
    if (!updatedUser.email) {
      updatedUser.email = authenticatedUser.email;
    }
    if (!updatedUser.image) {
      updatedUser.image = authenticatedUser.image || '';
    }
    if (!updatedUser.bio) {
      updatedUser.bio = authenticatedUser.bio || '';
    }
    updatedUser.token = getTokenFromEvent(event);

    return Util.envelop({
      user: updatedUser,
    });

  },

  authenticateAndGetUser,
  getUserByUsername,

  async getProfile(event) {
    const username = event.pathParameters.username;
    const authenticatedUser =
      await authenticateAndGetUser(event);
    const profile = await getProfileByUsername(username,
      authenticatedUser);
    if (!profile) {
      return Util.envelop(`User not found: [${username}]`, 422);
    }
    return Util.envelop({ profile });
  },

  getProfileByUsername,

  async follow(event) {
    const authenticatedUser = await authenticateAndGetUser(event);
    if (!authenticatedUser) {
      return Util.envelop('Token not present or invalid.', 422);
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
      if (user.followers &&
        user.followers.values.includes(authenticatedUser.username)) {
        user.followers.values = user.followers.values.filter(
          e => e != authenticatedUser.username
        );
        if (!user.followers.values.length) {
          delete user.followers;
        }
      }
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
      if (authenticatedUser.following &&
        authenticatedUser.following.values.includes(username)) {
        authenticatedUser.following.values =
          authenticatedUser.following.values.filter(
            e => e != username
          );
        /* istanbul ignore next  */
        if (!authenticatedUser.following.values.length) {
          delete authenticatedUser.following;
        }
      }
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
    return Util.envelop({ profile });
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
