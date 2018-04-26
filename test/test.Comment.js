const TestUtil = require('./TestUtil');
const axios = require('axios');
const API_URL = process.env.API_URL;

const globals = {
  authorUser: null,
  commenterUser: null,
  testArticle: null,
  createdComment: null,
};

describe('Comment', async () => {

  before(async () => {

    globals.authorUser = await TestUtil.createTestUser(
      `author-${(Math.random() * Math.pow(36, 6) | 0).toString(36)}`);
    globals.commenterUser = await TestUtil.createTestUser(
      `commenter-${(Math.random() * Math.pow(36, 6) | 0).toString(36)}`);
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
      globals.createdComment = (await axios.post(
        `${API_URL}/articles/${globals.testArticle.slug}/comments`, {
          comment: { body: "test comment" },
        }, {
          headers: { Authorization: `Token ${globals.commenterUser.token}` },
        })).data.comment;

      //TODO: Assert on createdComment
    });

  });

});
