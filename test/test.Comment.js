const TestUtil = require('./TestUtil');
const axios = require('axios');

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
    globals.testArticle = (await axios.post(`/articles`, {
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
          `/articles/${globals.testArticle.slug}/comments`, {
            comment: {
              body: `test comment ${TestUtil.randomString()}`
            },
          }, {
            headers: { Authorization: `Token ${globals.commenterUser.token}` },
          })).data.comment);
      }
      // TODO: Assert on createdComments
    });

  });

  describe('Get', async () => {

    it('should get all comments for article', async () => {
      const retrievedComments = (await axios.get(
          `/articles/${globals.testArticle.slug}/comments`))
        .data.comments;

      // TODO: Assert on retrievedComments
      (retrievedComments);
    });

  });

  describe('Delete', async () => {

    it('should delete comment', async () => {
      await axios.delete(`/articles/${globals.testArticle.slug}` +
        `/comments/${globals.createdComments[0].id}`, {
          headers: { Authorization: `Token ${globals.commenterUser.token}` },
        });

      // TODO: Assert comment is deleted
    });

    it('only comment author should be able to delete comment', async () => {
      await axios.delete(`/articles/${globals.testArticle.slug}` +
        `/comments/${globals.createdComments[1].id}`, {
          headers: { Authorization: `Token ${globals.authorUser.token}` },
        }).catch(res => {
        TestUtil.assertError(res, /Only comment author can delete/);
      });
    });

  });

});
