const TestUtil = require('./TestUtil');
const assert = require('assert');
const axios = require('axios');
const API_URL = process.env.API_URL;

const globals = {
  authorUser: null,
  createdArticleWithoutTags: null,
  createdArticleWithTags: null,
  nonAuthorUser: null,
};

describe('Article', async () => {

  before(async () => {
    globals.authorUser = await TestUtil.createTestUser(
      `author-${TestUtil.randomString()}`);

    globals.nonAuthorUser = await TestUtil.createTestUser(
      `non-author-${TestUtil.randomString()}`);
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

  describe('Favorite', async () => {

    it('should favorite article', async () => {
      const favoritedArticle = (await axios.post(`${API_URL}/articles/` +
        `${globals.createdArticleWithoutTags.slug}/favorite`, {}, {
          headers: { Authorization: `Token ${globals.nonAuthorUser.token}` },
        })).data.article;
      assert(favoritedArticle.favorited === true,
        `Expected article to have been favorited`);
    });

    it('should disallow favoriting by unauthenticated user', async () => {
      await axios.post(`${API_URL}/articles/` +
        `${globals.createdArticleWithoutTags.slug}/favorite`, {}, {
          headers: {
            Authorization: `Token ${globals.nonAuthorUser.token} foo`
          },
        }).catch(res => TestUtil.assertError(res, /Must be logged in/));
    });

    it('should disallow favoriting unknown article', async () => {
      await axios.post(`${API_URL}/articles/` +
        `${globals.createdArticleWithoutTags.slug}_foo/favorite`, {}, {
          headers: { Authorization: `Token ${globals.nonAuthorUser.token}` },
        }).catch(res => TestUtil.assertError(res, /Article not found/));
    });

    it('should unfavorite article', async () => {
      const unfavoritedArticle = (await axios.delete(`${API_URL}/articles/` +
        `${globals.createdArticleWithoutTags.slug}/favorite`, {
          headers: { Authorization: `Token ${globals.nonAuthorUser.token}` },
        })).data.article;
      assert(unfavoritedArticle.favorited === false,
        `Expected article to have been unfavorited`);
    });

  });

  describe('Delete', async () => {

    it('should delete article', async () => {
      await axios.delete(
        `${API_URL}/articles/${globals.createdArticleWithoutTags.slug}`, {
          headers: { Authorization: `Token ${globals.authorUser.token}` },
        });

      // Assert article is deleted
      await axios.get(
        `${API_URL}/articles/${globals.createdArticleWithoutTags.slug}`
      ).catch(res => TestUtil.assertError(res, /Article not found/));
    });

    it('should disallow deleting by unauthenticated user', async () => {
      await axios.delete(`${API_URL}/articles/foo`, {}, {
        headers: { Authorization: `Token ${globals.authorUser.token} foo` },
      }).catch(res => TestUtil.assertError(res, /Must be logged in/));
    });

    it('should disallow deleting unknown article', async () => {
      await axios.delete(
        `${API_URL}/articles/foobar`, {
          headers: { Authorization: `Token ${globals.authorUser.token}` },
        }).catch(res => TestUtil.assertError(res, /Article not found/));
    });

    it('should disallow deleting article by non-author', async () => {
      await axios.delete(
        `${API_URL}/articles/${globals.createdArticleWithTags.slug}`, {
          headers: { Authorization: `Token ${globals.nonAuthorUser.token}` },
        }).catch(res => TestUtil.assertError(res,
        /Article can only be deleted by author/));
    });

  });

  describe('List', async () => {

    it('should list articles', async () => {
      await axios.get(`${API_URL}/articles`);
      // TODO: Assert on retrieved articles
    });

    it('should list articles when authenticated', async () => {
      await axios.get(`${API_URL}/articles`, {
        headers: { Authorization: `Token ${globals.nonAuthorUser.token}` },
      });
      // TODO: Assert on retrieved articles
    });

  });

});
