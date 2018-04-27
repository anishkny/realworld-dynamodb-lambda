const TestUtil = require('./TestUtil');
const axios = require('axios');
const API_URL = process.env.API_URL;

const globals = {
  authorUser: null,
  commenterUser: null,
  testArticle: null,
  createdComments: [],
};

describe('Comment', async () => {

  before(async () => {

    globals.authorUser = await TestUtil.createTestUser(
      `author-${TestUtil.randomString()}`);
    globals.commenterUser = await TestUtil.createTestUser(
      `commenter-${TestUtil.randomString()}`);
    globals.testArticle = (await axios.post(`${API_URL}/articles`, {
      article: {
        title: 'title',
        description: 'description',
        body: 'body'
      },
    }, {
      headers: { Authorization: `Token ${globals.authorUser.token}` },
    })).data.article;

  });

  describe('Create', async () => {

    it('should create comment', async () => {
      for (let i = 0; i < 10; ++i) {
        globals.createdComments.push((await axios.post(
          `${API_URL}/articles/${globals.testArticle.slug}/comments`, {
            comment: {
              body: `test comment ${TestUtil.randomString()}`
            },
          }, {
            headers: { Authorization: `Token ${globals.commenterUser.token}` },
          })).data.comment);
      }
      // TODO: Assert on createdComments
    });

    it('should get all comments for article', async () => {
      const retrievedComments = (await axios.get(
          `${API_URL}/articles/${globals.testArticle.slug}/comments`))
        .data.comments;

      // TODO: Assert on retrievedComments
      (retrievedComments);
    });

  });

});
