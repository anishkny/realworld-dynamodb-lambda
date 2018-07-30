const TestUtil = require('./TestUtil');
const assert = require('assert');
const axios = require('axios');

const globals = {
  authorUser: null,
  authoressUser: null,
  createdArticleWithoutTags: null,
  createdArticleWithTags: null,
  listArticles: [],
  nonAuthorUser: null,
};

describe('Article', async () => {

  before(async () => {
    globals.authorUser = await TestUtil.createTestUser(
      `author-${TestUtil.randomString()}`);

    globals.authoressUser = await TestUtil.createTestUser(
      `authoress-${TestUtil.randomString()}`);

    globals.nonAuthorUser = await TestUtil.createTestUser(
      `non-author-${TestUtil.randomString()}`);
  });

  describe('Create', async () => {

    it('should create article', async () => {
      globals.createdArticleWithoutTags =
        (await axios.post(`/articles`, {
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
        (await axios.post(`/articles`, {
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
      await axios.post(`/articles`, {}, {
        headers: { Authorization: `Token ${globals.authorUser.token} foo` },
      }).catch(res => TestUtil.assertError(res, /Must be logged in/));
    });

    it('should enforce required fields', async () => {
      await axios.post(`/articles`, {}, {
        headers: { Authorization: `Token ${globals.authorUser.token}` },
      }).catch(res => {
        TestUtil.assertError(res, /Article must be specified/);
      });
      await axios.post(`/articles`, {
        article: {},
      }, {
        headers: { Authorization: `Token ${globals.authorUser.token}` },
      }).catch(res => {
        TestUtil.assertError(res, /title must be specified/);
      });
      await axios.post(`/articles`, {
        article: { title: 'title', },
      }, {
        headers: { Authorization: `Token ${globals.authorUser.token}` },
      }).catch(res => {
        TestUtil.assertError(res, /description must be specified/);
      });
      await axios.post(`/articles`, {
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
          `/articles/${globals.createdArticleWithoutTags.slug}`))
        .data.article;

      // TODO: Assert on retrievedArticle
      (retrievedArticle);
    });

    it('should get article with tags by slug', async () => {
      const retrievedArticle = (await axios.get(
          `/articles/${globals.createdArticleWithTags.slug}`))
        .data.article;

      // TODO: Assert on retrievedArticle
      (retrievedArticle);
    });

    it('should disallow unknown slug', async () => {
      await axios.get(
          `/articles/${Math.random().toString(36).substring(7)}`)
        .catch(res => {
          TestUtil.assertError(res, /Article not found/);
        });
    });

    // TODO: Add Article.get edge cases

  });

  describe('Update', async () => {

    it('should update article', async () => {
      let updatedArticle;

      updatedArticle = (await axios.put(
        `/articles/${globals.createdArticleWithTags.slug}`, {
          article: { title: 'newtitle' },
        }, {
          headers: { Authorization: `Token ${globals.authorUser.token}` },
        })).data.article;
      assert.equal(updatedArticle.title, 'newtitle');

      updatedArticle = (await axios.put(
        `/articles/${globals.createdArticleWithTags.slug}`, {
          article: { description: 'newdescription' },
        }, {
          headers: { Authorization: `Token ${globals.authorUser.token}` },
        })).data.article;
      assert.equal(updatedArticle.description, 'newdescription');

      updatedArticle = (await axios.put(
        `/articles/${globals.createdArticleWithTags.slug}`, {
          article: { body: 'newbody' },
        }, {
          headers: { Authorization: `Token ${globals.authorUser.token}` },
        })).data.article;
      assert.equal(updatedArticle.body, 'newbody');

    });

    it('should disallow missing mutation', async () => {
      await axios.put(`/articles/${globals.createdArticleWithTags.slug}`, {})
        .catch(res => {
          TestUtil.assertError(res, /Article mutation must be specified/);
        });
    });

    it('should disallow empty mutation', async () => {
      await axios.put(`/articles/${globals.createdArticleWithTags.slug}`, {
        article: {},
      }).catch(res => {
        TestUtil.assertError(res, /At least one field must be specified/);
      });
    });

    it('should disallow unauthenticated update', async () => {
      await axios.put(`/articles/${globals.createdArticleWithTags.slug}`, {
        article: { title: 'newtitle' },
      }).catch(res => {
        TestUtil.assertError(res, /Must be logged in/);
      });
    });

    it('should disallow updating non-existent article', async () => {
      await axios.put(`/articles/foo-${globals.createdArticleWithTags.slug}`, {
        article: { title: 'newtitle' },
      }, {
        headers: { Authorization: `Token ${globals.authorUser.token}` },
      }).catch(res => {
        TestUtil.assertError(res, /Article not found/);
      });
    });

    it('should disallow non-author from updating', async () => {
      await axios.put(`/articles/${globals.createdArticleWithTags.slug}`, {
        article: { title: 'newtitle' },
      }, {
        headers: { Authorization: `Token ${globals.authoressUser.token}` },
      }).catch(res => {
        TestUtil.assertError(res, /Article can only be updated by author/);
      });
    });

  });

  describe('Favorite', async () => {

    it('should favorite article', async () => {
      const favoritedArticle = (await axios.post(`/articles/` +
        `${globals.createdArticleWithoutTags.slug}/favorite`, {}, {
          headers: { Authorization: `Token ${globals.nonAuthorUser.token}` },
        })).data.article;
      assert(favoritedArticle.favorited === true,
        `Expected article to have been favorited`);

      const retrievedArticle = (await axios.get(`/articles/` +
        `${globals.createdArticleWithoutTags.slug}`, {
          headers: { Authorization: `Token ${globals.nonAuthorUser.token}` },
        })).data.article;
      assert(retrievedArticle.favorited === true,
        `Expected article to have been favorited`);
    });

    it('should disallow favoriting by unauthenticated user', async () => {
      await axios.post(`/articles/` +
        `${globals.createdArticleWithoutTags.slug}/favorite`, {}, {
          headers: {
            Authorization: `Token ${globals.nonAuthorUser.token} foo`
          },
        }).catch(res => TestUtil.assertError(res, /Must be logged in/));
    });

    it('should disallow favoriting unknown article', async () => {
      await axios.post(`/articles/` +
        `${globals.createdArticleWithoutTags.slug}_foo/favorite`, {}, {
          headers: { Authorization: `Token ${globals.nonAuthorUser.token}` },
        }).catch(res => TestUtil.assertError(res, /Article not found/));
    });

    it('should unfavorite article', async () => {
      const unfavoritedArticle = (await axios.delete(`/articles/` +
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
        `/articles/${globals.createdArticleWithoutTags.slug}`, {
          headers: { Authorization: `Token ${globals.authorUser.token}` },
        });

      // Assert article is deleted
      await axios.get(
        `/articles/${globals.createdArticleWithoutTags.slug}`
      ).catch(res => TestUtil.assertError(res, /Article not found/));
    });

    it('should disallow deleting by unauthenticated user', async () => {
      await axios.delete(`/articles/foo`, {}, {
        headers: { Authorization: `Token ${globals.authorUser.token} foo` },
      }).catch(res => TestUtil.assertError(res, /Must be logged in/));
    });

    it('should disallow deleting unknown article', async () => {
      await axios.delete(
        `/articles/foobar`, {
          headers: { Authorization: `Token ${globals.authorUser.token}` },
        }).catch(res => TestUtil.assertError(res, /Article not found/));
    });

    it('should disallow deleting article by non-author', async () => {
      await axios.delete(
        `/articles/${globals.createdArticleWithTags.slug}`, {
          headers: { Authorization: `Token ${globals.nonAuthorUser.token}` },
        }).catch(res => TestUtil.assertError(res,
        /Article can only be deleted by author/));
    });

  });

  describe('List', async () => {

    before(async () => {
      // Create a few articles to be listed
      for (let i = 0; i < 20; ++i) {
        globals.listArticles.push((await axios.post(`/articles`, {
          article: {
            title: 'title',
            description: 'description',
            body: 'body',
            tagList: [
              TestUtil.randomString(),
              `tag_${i}`,
              `tag_mod_2_${(i % 2)}`,
              `tag_mod_3_${(i % 3)}`,
            ],
          },
        }, {
          headers: {
            Authorization: 'Token ' +
              ((i % 2) ? globals.authorUser.token : globals.authoressUser.token)
          },
        })).data.article);
      }
    });

    it('should list articles', async () => {
      const allArticles =
        (await axios.get(`/articles`)).data.articles;
      // TODO: Assert on retrieved articles
      (allArticles);
    });

    it('should list articles with tag', async () => {
      const articles_tag_7 =
        (await axios.get(`/articles?tag=tag_7`)).data.articles;
      (articles_tag_7);

      const articles_tag_mod_3_2 =
        (await axios.get(`/articles?tag=tag_mod_3_2`)).data.articles;
      (articles_tag_mod_3_2);

      // TODO: Assert on retrieved articles
    });

    it('should list articles by author', async () => {
      const articles_of_authoress = (await axios.get(
          `/articles?author=${globals.authoressUser.username}`))
        .data.articles;
      (articles_of_authoress);

      // TODO: Assert on retrieved articles
    });

    it('should list articles favorited by user', async () => {
      const favorited_articles = (await axios.get(
          `/articles?favorited=${globals.nonAuthorUser.username}`))
        .data.articles;
      (favorited_articles);

      // TODO: Assert on retrieved articles
    });

    it('should list articles by limit/offset', async () => {
      const articles_batch_1 = (await axios.get(
          `/articles?author=${globals.authorUser.username}&limit=2`))
        .data.articles;
      (articles_batch_1);

      const articles_batch_2 = (await axios.get(
          `/articles?author=${globals.authorUser.username}` +
          `&limit=2&offset=2`))
        .data.articles;
      (articles_batch_2);

      // TODO: Assert on retrieved articles
    });

    it('should list articles when authenticated', async () => {
      await axios.get(`/articles`, {
        headers: { Authorization: `Token ${globals.nonAuthorUser.token}` },
      });
      // TODO: Assert on retrieved articles
    });

    it('should disallow multiple of author/tag/favorited', async () => {
      [
        ['tag', 'author', ],
        ['author', 'favorited', ],
        ['favorited', 'tag', ],
      ].forEach(async (params) => {
        await axios.get(`/articles?${params[0]}=foo&${params[1]}=bar`)
          .catch(res => TestUtil.assertError(res,
            /Only one of these can be specified/));
      });
    });

  });

  describe('Feed', async () => {

    it('should get feed', async () => {
      // Get feed without following any user
      const feed0 = (await axios.get(`/articles/feed`, {
        headers: { Authorization: `Token ${globals.nonAuthorUser.token}` },
      })).data.articles;
      (feed0);
      // TODO: Assert on feed

      // Get feed after following only authoressUser
      await axios.post(
        `/profiles/${globals.authoressUser.username}/follow`, {}, {
          headers: { Authorization: `Token ${globals.nonAuthorUser.token}` },
        });
      const feed1 = (await axios.get(`/articles/feed`, {
        headers: { Authorization: `Token ${globals.nonAuthorUser.token}` },
      })).data.articles;
      (feed1);
      // TODO: Assert on feed

      // Get feed after following authorUser too
      await axios.post(
        `/profiles/${globals.authorUser.username}/follow`, {}, {
          headers: { Authorization: `Token ${globals.nonAuthorUser.token}` },
        });
      const feed2 = (await axios.get(`/articles/feed`, {
        headers: { Authorization: `Token ${globals.nonAuthorUser.token}` },
      })).data.articles;
      (feed2);
      // TODO: Assert on feed
    });

    it('should disallow unauthenticated feed', async () => {
      await axios.get('/articles/feed').catch(res => TestUtil.assertError(res,
        /Must be logged in/));
    });

  });

  describe('Tags', async () => {

    it('should get tags', async () => {
      const tags = (await axios.get('/tags')).data.tags;
      // TODO: Assert on tags
      (tags);
    });

  });

});
