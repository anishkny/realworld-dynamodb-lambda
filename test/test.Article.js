const TestUtil = require('./TestUtil');
const axios = require('axios');
const API_URL = process.env.API_URL;

const globals = {
  authorUser: null,
  createdArticleWithoutTags: null,
  createdArticleWithTags: null,
};

describe('Article', async () => {

  before(async () => {
    const username =
      `author-${(Math.random() * Math.pow(36, 6) | 0).toString(36)}`;

    globals.authorUser = (await axios.post(
      `${process.env.API_URL}/users`, {
        user: {
          email: `${username}@email.com`,
          username: username,
          password: 'password',
        }
      })).data.user;
  });

  describe('Create', async () => {

    it('should create article', async () => {
      globals.createdArticleWithoutTags =
        (await axios.post(`${API_URL}/articles`, {
          article: {
            title: 'title',
            description: 'description',
            body: 'body'
          },
        }, {
          headers: { Authorization: `Token ${globals.authorUser.token}` },
        })).data.article;

      // TODO: Assert on createdArticleWithoutTags
    });

    it('should create article with tags', async () => {
      globals.createdArticleWithTags =
        (await axios.post(`${API_URL}/articles`, {
          article: {
            title: 'title',
            description: 'description',
            body: 'body',
            tagList: ['tag_a', 'tag_b'],
          },
        }, {
          headers: { Authorization: `Token ${globals.authorUser.token}` },
        })).data.article;

      // TODO: Assert on createdArticleWithTags
    });

    it('should disallow unauthenticated user', async () => {
      await axios.post(`${API_URL}/articles`, {}, {
        headers: { Authorization: `Token ${globals.authorUser.token} foo` },
      }).catch(res => TestUtil.assertError(res, /Must be logged in/));
    });

    it('should enforce required fields', async () => {
      await axios.post(`${process.env.API_URL}/articles`, {}, {
        headers: { Authorization: `Token ${globals.authorUser.token}` },
      }).catch(res => {
        TestUtil.assertError(res, /Article must be specified/);
      });
      await axios.post(`${process.env.API_URL}/articles`, {
        article: {},
      }, {
        headers: { Authorization: `Token ${globals.authorUser.token}` },
      }).catch(res => {
        TestUtil.assertError(res, /title must be specified/);
      });
      await axios.post(`${process.env.API_URL}/articles`, {
        article: { title: 'title', },
      }, {
        headers: { Authorization: `Token ${globals.authorUser.token}` },
      }).catch(res => {
        TestUtil.assertError(res, /description must be specified/);
      });
      await axios.post(`${process.env.API_URL}/articles`, {
        article: { title: 'title', description: 'description', },
      }, {
        headers: { Authorization: `Token ${globals.authorUser.token}` },
      }).catch(res => {
        TestUtil.assertError(res, /body must be specified/);
      });
    });

  });

  describe('Get', async () => {

    it('should get article by slug', async () => {
      const retrievedArticle = (await axios.get(
          `${API_URL}/articles/${globals.createdArticleWithoutTags.slug}`))
        .data.article;

      // TODO: Assert on retrievedArticle
      (retrievedArticle);
    });

    it('should get article with tags by slug', async () => {
      const retrievedArticle = (await axios.get(
          `${API_URL}/articles/${globals.createdArticleWithTags.slug}`))
        .data.article;

      // TODO: Assert on retrievedArticle
      (retrievedArticle);
    });

    it('should disallow unknown slug', async () => {
      await axios.get(
          `${API_URL}/articles/${Math.random().toString(36).substring(7)}`)
        .catch(res => {
          TestUtil.assertError(res, /Article not found/);
        });
    });

    // TODO: Add Article.get edge cases

  });

});
