```
DELETE /__TESTUTILS__/purge
```
```
200 OK

"Purged all data!"
```
# Article
```
POST /users

{
  "user": {
    "email": "author-vr9rct@email.com",
    "username": "author-vr9rct",
    "password": "password"
  }
}
```
```
200 OK

{
  "user": {
    "email": "author-vr9rct@email.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImF1dGhvci12cjlyY3QiLCJpYXQiOjE2MjM3MjU1MjksImV4cCI6MTYyMzg5ODMyOX0.qJ8lZ9otsKtQW8LX-ymAIVMOsiWOCXu0lW7IwYk3eI4",
    "username": "author-vr9rct",
    "bio": "",
    "image": ""
  }
}
```
```
POST /users

{
  "user": {
    "email": "authoress-7ue3fa@email.com",
    "username": "authoress-7ue3fa",
    "password": "password"
  }
}
```
```
200 OK

{
  "user": {
    "email": "authoress-7ue3fa@email.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImF1dGhvcmVzcy03dWUzZmEiLCJpYXQiOjE2MjM3MjU1MjksImV4cCI6MTYyMzg5ODMyOX0.UsHF7C5Gnc5I4eBslJkgy8fbFNGVAp8mfo0pMWKBogg",
    "username": "authoress-7ue3fa",
    "bio": "",
    "image": ""
  }
}
```
```
POST /users

{
  "user": {
    "email": "non-author-wuomm1@email.com",
    "username": "non-author-wuomm1",
    "password": "password"
  }
}
```
```
200 OK

{
  "user": {
    "email": "non-author-wuomm1@email.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5vbi1hdXRob3Itd3VvbW0xIiwiaWF0IjoxNjIzNzI1NTI5LCJleHAiOjE2MjM4OTgzMjl9.tLx2SJZHw7csAoiM01GimEjhVQ99ykqoQvMkUeH_P78",
    "username": "non-author-wuomm1",
    "bio": "",
    "image": ""
  }
}
```
## Create
### should create article
```
POST /articles

{
  "article": {
    "title": "title",
    "description": "description",
    "body": "body"
  }
}
```
```
200 OK

{
  "article": {
    "slug": "title-ayr35a",
    "title": "title",
    "description": "description",
    "body": "body",
    "createdAt": 1623725529740,
    "updatedAt": 1623725529740,
    "author": {
      "username": "author-vr9rct",
      "bio": "",
      "image": "",
      "following": false
    },
    "tagList": [],
    "favorited": false,
    "favoritesCount": 0
  }
}
```
### should create article with tags
```
POST /articles

{
  "article": {
    "title": "title",
    "description": "description",
    "body": "body",
    "tagList": [
      "tag_a",
      "tag_b"
    ]
  }
}
```
```
200 OK

{
  "article": {
    "slug": "title-qyr4nh",
    "title": "title",
    "description": "description",
    "body": "body",
    "createdAt": 1623725529774,
    "updatedAt": 1623725529774,
    "author": {
      "username": "author-vr9rct",
      "bio": "",
      "image": "",
      "following": false
    },
    "tagList": [
      "tag_a",
      "tag_b"
    ],
    "favorited": false,
    "favoritesCount": 0
  }
}
```
### should disallow unauthenticated user
```
POST /articles

{}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Must be logged in."
    ]
  }
}
```
### should enforce required fields
```
POST /articles

{}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Article must be specified."
    ]
  }
}
```
```
POST /articles

{
  "article": {}
}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "title must be specified."
    ]
  }
}
```
```
POST /articles

{
  "article": {
    "title": "title"
  }
}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "description must be specified."
    ]
  }
}
```
```
POST /articles

{
  "article": {
    "title": "title",
    "description": "description"
  }
}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "body must be specified."
    ]
  }
}
```
## Get
### should get article by slug
```
GET /articles/title-ayr35a
```
```
200 OK

{
  "article": {
    "createdAt": 1623725529740,
    "author": {
      "username": "author-vr9rct",
      "bio": "",
      "image": "",
      "following": false
    },
    "description": "description",
    "title": "title",
    "body": "body",
    "slug": "title-ayr35a",
    "updatedAt": 1623725529740,
    "tagList": [],
    "favoritesCount": 0,
    "favorited": false
  }
}
```
### should get article with tags by slug
```
GET /articles/title-qyr4nh
```
```
200 OK

{
  "article": {
    "tagList": [
      "tag_a",
      "tag_b"
    ],
    "createdAt": 1623725529774,
    "author": {
      "username": "author-vr9rct",
      "bio": "",
      "image": "",
      "following": false
    },
    "description": "description",
    "title": "title",
    "body": "body",
    "slug": "title-qyr4nh",
    "updatedAt": 1623725529774,
    "favoritesCount": 0,
    "favorited": false
  }
}
```
### should disallow unknown slug
```
GET /articles/zvhtkq
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Article not found: [zvhtkq]"
    ]
  }
}
```
## Update
### should update article
```
PUT /articles/title-qyr4nh

{
  "article": {
    "title": "newtitle"
  }
}
```
```
200 OK

{
  "article": {
    "tagList": [
      "tag_a",
      "tag_b"
    ],
    "createdAt": 1623725529774,
    "author": {
      "username": "author-vr9rct",
      "bio": "",
      "image": "",
      "following": false
    },
    "description": "description",
    "title": "newtitle",
    "body": "body",
    "slug": "title-qyr4nh",
    "updatedAt": 1623725529774,
    "favoritesCount": 0,
    "favorited": false
  }
}
```
```
PUT /articles/title-qyr4nh

{
  "article": {
    "description": "newdescription"
  }
}
```
```
200 OK

{
  "article": {
    "tagList": [
      "tag_a",
      "tag_b"
    ],
    "createdAt": 1623725529774,
    "author": {
      "username": "author-vr9rct",
      "bio": "",
      "image": "",
      "following": false
    },
    "description": "newdescription",
    "title": "newtitle",
    "body": "body",
    "slug": "title-qyr4nh",
    "updatedAt": 1623725529774,
    "favoritesCount": 0,
    "favorited": false
  }
}
```
```
PUT /articles/title-qyr4nh

{
  "article": {
    "body": "newbody"
  }
}
```
```
200 OK

{
  "article": {
    "tagList": [
      "tag_a",
      "tag_b"
    ],
    "createdAt": 1623725529774,
    "author": {
      "username": "author-vr9rct",
      "bio": "",
      "image": "",
      "following": false
    },
    "description": "newdescription",
    "title": "newtitle",
    "body": "newbody",
    "slug": "title-qyr4nh",
    "updatedAt": 1623725529774,
    "favoritesCount": 0,
    "favorited": false
  }
}
```
### should disallow missing mutation
```
PUT /articles/title-qyr4nh

{}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Article mutation must be specified."
    ]
  }
}
```
### should disallow empty mutation
```
PUT /articles/title-qyr4nh

{
  "article": {}
}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "At least one field must be specified: [title, description, article]."
    ]
  }
}
```
### should disallow unauthenticated update
```
PUT /articles/title-qyr4nh

{
  "article": {
    "title": "newtitle"
  }
}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Must be logged in."
    ]
  }
}
```
### should disallow updating non-existent article
```
PUT /articles/foo-title-qyr4nh

{
  "article": {
    "title": "newtitle"
  }
}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Article not found: [foo-title-qyr4nh]"
    ]
  }
}
```
### should disallow non-author from updating
```
PUT /articles/title-qyr4nh

{
  "article": {
    "title": "newtitle"
  }
}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Article can only be updated by author: [author-vr9rct]"
    ]
  }
}
```
## Favorite
### should favorite article
```
POST /articles/title-ayr35a/favorite

{}
```
```
200 OK

{
  "article": {
    "createdAt": 1623725529740,
    "author": {
      "username": "author-vr9rct",
      "bio": "",
      "image": "",
      "following": false
    },
    "description": "description",
    "title": "title",
    "body": "body",
    "slug": "title-ayr35a",
    "updatedAt": 1623725529740,
    "favoritedBy": [
      "non-author-wuomm1"
    ],
    "favoritesCount": 1,
    "tagList": [],
    "favorited": true
  }
}
```
```
GET /articles/title-ayr35a
```
```
200 OK

{
  "article": {
    "createdAt": 1623725529740,
    "author": {
      "username": "author-vr9rct",
      "bio": "",
      "image": "",
      "following": false
    },
    "description": "description",
    "title": "title",
    "body": "body",
    "favoritesCount": 1,
    "slug": "title-ayr35a",
    "updatedAt": 1623725529740,
    "tagList": [],
    "favorited": true
  }
}
```
### should disallow favoriting by unauthenticated user
```
POST /articles/title-ayr35a/favorite

{}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Must be logged in."
    ]
  }
}
```
### should disallow favoriting unknown article
```
POST /articles/title-ayr35a_foo/favorite

{}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Article not found: [title-ayr35a_foo]"
    ]
  }
}
```
### should unfavorite article
```
DELETE /articles/title-ayr35a/favorite
```
```
200 OK

{
  "article": {
    "createdAt": 1623725529740,
    "author": {
      "username": "author-vr9rct",
      "bio": "",
      "image": "",
      "following": false
    },
    "description": "description",
    "title": "title",
    "body": "body",
    "favoritesCount": 0,
    "slug": "title-ayr35a",
    "updatedAt": 1623725529740,
    "tagList": [],
    "favorited": false
  }
}
```
## Delete
### should delete article
```
DELETE /articles/title-ayr35a
```
```
200 OK

{}
```
```
GET /articles/title-ayr35a
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Article not found: [title-ayr35a]"
    ]
  }
}
```
### should disallow deleting by unauthenticated user
```
DELETE /articles/foo
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Must be logged in."
    ]
  }
}
```
### should disallow deleting unknown article
```
DELETE /articles/foobar
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Article not found: [foobar]"
    ]
  }
}
```
### should disallow deleting article by non-author
```
DELETE /articles/title-qyr4nh
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Article can only be deleted by author: [author-vr9rct]"
    ]
  }
}
```
## List
```
POST /articles

{
  "article": {
    "title": "title",
    "description": "description",
    "body": "body",
    "tagList": [
      "vls20i",
      "tag_0",
      "tag_mod_2_0",
      "tag_mod_3_0"
    ]
  }
}
```
```
200 OK

{
  "article": {
    "slug": "title-cw03ww",
    "title": "title",
    "description": "description",
    "body": "body",
    "createdAt": 1623725530467,
    "updatedAt": 1623725530467,
    "author": {
      "username": "authoress-7ue3fa",
      "bio": "",
      "image": "",
      "following": false
    },
    "tagList": [
      "vls20i",
      "tag_0",
      "tag_mod_2_0",
      "tag_mod_3_0"
    ],
    "favorited": false,
    "favoritesCount": 0
  }
}
```
```
POST /articles

{
  "article": {
    "title": "title",
    "description": "description",
    "body": "body",
    "tagList": [
      "z4lwzp",
      "tag_1",
      "tag_mod_2_1",
      "tag_mod_3_1"
    ]
  }
}
```
```
200 OK

{
  "article": {
    "slug": "title-rpr5l8",
    "title": "title",
    "description": "description",
    "body": "body",
    "createdAt": 1623725530506,
    "updatedAt": 1623725530506,
    "author": {
      "username": "author-vr9rct",
      "bio": "",
      "image": "",
      "following": false
    },
    "tagList": [
      "z4lwzp",
      "tag_1",
      "tag_mod_2_1",
      "tag_mod_3_1"
    ],
    "favorited": false,
    "favoritesCount": 0
  }
}
```
```
POST /articles

{
  "article": {
    "title": "title",
    "description": "description",
    "body": "body",
    "tagList": [
      "dv9nw3",
      "tag_2",
      "tag_mod_2_0",
      "tag_mod_3_2"
    ]
  }
}
```
```
200 OK

{
  "article": {
    "slug": "title-5ejhwo",
    "title": "title",
    "description": "description",
    "body": "body",
    "createdAt": 1623725530530,
    "updatedAt": 1623725530530,
    "author": {
      "username": "authoress-7ue3fa",
      "bio": "",
      "image": "",
      "following": false
    },
    "tagList": [
      "dv9nw3",
      "tag_2",
      "tag_mod_2_0",
      "tag_mod_3_2"
    ],
    "favorited": false,
    "favoritesCount": 0
  }
}
```
```
POST /articles

{
  "article": {
    "title": "title",
    "description": "description",
    "body": "body",
    "tagList": [
      "60kdar",
      "tag_3",
      "tag_mod_2_1",
      "tag_mod_3_0"
    ]
  }
}
```
```
200 OK

{
  "article": {
    "slug": "title-qyzp01",
    "title": "title",
    "description": "description",
    "body": "body",
    "createdAt": 1623725530549,
    "updatedAt": 1623725530549,
    "author": {
      "username": "author-vr9rct",
      "bio": "",
      "image": "",
      "following": false
    },
    "tagList": [
      "60kdar",
      "tag_3",
      "tag_mod_2_1",
      "tag_mod_3_0"
    ],
    "favorited": false,
    "favoritesCount": 0
  }
}
```
```
POST /articles

{
  "article": {
    "title": "title",
    "description": "description",
    "body": "body",
    "tagList": [
      "xhvh6v",
      "tag_4",
      "tag_mod_2_0",
      "tag_mod_3_1"
    ]
  }
}
```
```
200 OK

{
  "article": {
    "slug": "title-jrl2st",
    "title": "title",
    "description": "description",
    "body": "body",
    "createdAt": 1623725530570,
    "updatedAt": 1623725530570,
    "author": {
      "username": "authoress-7ue3fa",
      "bio": "",
      "image": "",
      "following": false
    },
    "tagList": [
      "xhvh6v",
      "tag_4",
      "tag_mod_2_0",
      "tag_mod_3_1"
    ],
    "favorited": false,
    "favoritesCount": 0
  }
}
```
```
POST /articles

{
  "article": {
    "title": "title",
    "description": "description",
    "body": "body",
    "tagList": [
      "qjcgr0",
      "tag_5",
      "tag_mod_2_1",
      "tag_mod_3_2"
    ]
  }
}
```
```
200 OK

{
  "article": {
    "slug": "title-2bomgm",
    "title": "title",
    "description": "description",
    "body": "body",
    "createdAt": 1623725530590,
    "updatedAt": 1623725530590,
    "author": {
      "username": "author-vr9rct",
      "bio": "",
      "image": "",
      "following": false
    },
    "tagList": [
      "qjcgr0",
      "tag_5",
      "tag_mod_2_1",
      "tag_mod_3_2"
    ],
    "favorited": false,
    "favoritesCount": 0
  }
}
```
```
POST /articles

{
  "article": {
    "title": "title",
    "description": "description",
    "body": "body",
    "tagList": [
      "qkzdu3",
      "tag_6",
      "tag_mod_2_0",
      "tag_mod_3_0"
    ]
  }
}
```
```
200 OK

{
  "article": {
    "slug": "title-j6w6d2",
    "title": "title",
    "description": "description",
    "body": "body",
    "createdAt": 1623725530610,
    "updatedAt": 1623725530610,
    "author": {
      "username": "authoress-7ue3fa",
      "bio": "",
      "image": "",
      "following": false
    },
    "tagList": [
      "qkzdu3",
      "tag_6",
      "tag_mod_2_0",
      "tag_mod_3_0"
    ],
    "favorited": false,
    "favoritesCount": 0
  }
}
```
```
POST /articles

{
  "article": {
    "title": "title",
    "description": "description",
    "body": "body",
    "tagList": [
      "7cuze9",
      "tag_7",
      "tag_mod_2_1",
      "tag_mod_3_1"
    ]
  }
}
```
```
200 OK

{
  "article": {
    "slug": "title-ygselz",
    "title": "title",
    "description": "description",
    "body": "body",
    "createdAt": 1623725530637,
    "updatedAt": 1623725530637,
    "author": {
      "username": "author-vr9rct",
      "bio": "",
      "image": "",
      "following": false
    },
    "tagList": [
      "7cuze9",
      "tag_7",
      "tag_mod_2_1",
      "tag_mod_3_1"
    ],
    "favorited": false,
    "favoritesCount": 0
  }
}
```
```
POST /articles

{
  "article": {
    "title": "title",
    "description": "description",
    "body": "body",
    "tagList": [
      "ugh70l",
      "tag_8",
      "tag_mod_2_0",
      "tag_mod_3_2"
    ]
  }
}
```
```
200 OK

{
  "article": {
    "slug": "title-bjnnj2",
    "title": "title",
    "description": "description",
    "body": "body",
    "createdAt": 1623725530654,
    "updatedAt": 1623725530654,
    "author": {
      "username": "authoress-7ue3fa",
      "bio": "",
      "image": "",
      "following": false
    },
    "tagList": [
      "ugh70l",
      "tag_8",
      "tag_mod_2_0",
      "tag_mod_3_2"
    ],
    "favorited": false,
    "favoritesCount": 0
  }
}
```
```
POST /articles

{
  "article": {
    "title": "title",
    "description": "description",
    "body": "body",
    "tagList": [
      "8j4vb7",
      "tag_9",
      "tag_mod_2_1",
      "tag_mod_3_0"
    ]
  }
}
```
```
200 OK

{
  "article": {
    "slug": "title-e5f1ob",
    "title": "title",
    "description": "description",
    "body": "body",
    "createdAt": 1623725530677,
    "updatedAt": 1623725530677,
    "author": {
      "username": "author-vr9rct",
      "bio": "",
      "image": "",
      "following": false
    },
    "tagList": [
      "8j4vb7",
      "tag_9",
      "tag_mod_2_1",
      "tag_mod_3_0"
    ],
    "favorited": false,
    "favoritesCount": 0
  }
}
```
```
POST /articles

{
  "article": {
    "title": "title",
    "description": "description",
    "body": "body",
    "tagList": [
      "ij6ibg",
      "tag_10",
      "tag_mod_2_0",
      "tag_mod_3_1"
    ]
  }
}
```
```
200 OK

{
  "article": {
    "slug": "title-kiggu",
    "title": "title",
    "description": "description",
    "body": "body",
    "createdAt": 1623725530702,
    "updatedAt": 1623725530702,
    "author": {
      "username": "authoress-7ue3fa",
      "bio": "",
      "image": "",
      "following": false
    },
    "tagList": [
      "ij6ibg",
      "tag_10",
      "tag_mod_2_0",
      "tag_mod_3_1"
    ],
    "favorited": false,
    "favoritesCount": 0
  }
}
```
```
POST /articles

{
  "article": {
    "title": "title",
    "description": "description",
    "body": "body",
    "tagList": [
      "jvhyax",
      "tag_11",
      "tag_mod_2_1",
      "tag_mod_3_2"
    ]
  }
}
```
```
200 OK

{
  "article": {
    "slug": "title--z5g3tz",
    "title": "title",
    "description": "description",
    "body": "body",
    "createdAt": 1623725530721,
    "updatedAt": 1623725530721,
    "author": {
      "username": "author-vr9rct",
      "bio": "",
      "image": "",
      "following": false
    },
    "tagList": [
      "jvhyax",
      "tag_11",
      "tag_mod_2_1",
      "tag_mod_3_2"
    ],
    "favorited": false,
    "favoritesCount": 0
  }
}
```
```
POST /articles

{
  "article": {
    "title": "title",
    "description": "description",
    "body": "body",
    "tagList": [
      "uhm4dq",
      "tag_12",
      "tag_mod_2_0",
      "tag_mod_3_0"
    ]
  }
}
```
```
200 OK

{
  "article": {
    "slug": "title-b8ovm8",
    "title": "title",
    "description": "description",
    "body": "body",
    "createdAt": 1623725530741,
    "updatedAt": 1623725530741,
    "author": {
      "username": "authoress-7ue3fa",
      "bio": "",
      "image": "",
      "following": false
    },
    "tagList": [
      "uhm4dq",
      "tag_12",
      "tag_mod_2_0",
      "tag_mod_3_0"
    ],
    "favorited": false,
    "favoritesCount": 0
  }
}
```
```
POST /articles

{
  "article": {
    "title": "title",
    "description": "description",
    "body": "body",
    "tagList": [
      "s0ucyw",
      "tag_13",
      "tag_mod_2_1",
      "tag_mod_3_1"
    ]
  }
}
```
```
200 OK

{
  "article": {
    "slug": "title-5cn7ah",
    "title": "title",
    "description": "description",
    "body": "body",
    "createdAt": 1623725530760,
    "updatedAt": 1623725530760,
    "author": {
      "username": "author-vr9rct",
      "bio": "",
      "image": "",
      "following": false
    },
    "tagList": [
      "s0ucyw",
      "tag_13",
      "tag_mod_2_1",
      "tag_mod_3_1"
    ],
    "favorited": false,
    "favoritesCount": 0
  }
}
```
```
POST /articles

{
  "article": {
    "title": "title",
    "description": "description",
    "body": "body",
    "tagList": [
      "irafm0",
      "tag_14",
      "tag_mod_2_0",
      "tag_mod_3_2"
    ]
  }
}
```
```
200 OK

{
  "article": {
    "slug": "title-wfuwas",
    "title": "title",
    "description": "description",
    "body": "body",
    "createdAt": 1623725530784,
    "updatedAt": 1623725530784,
    "author": {
      "username": "authoress-7ue3fa",
      "bio": "",
      "image": "",
      "following": false
    },
    "tagList": [
      "irafm0",
      "tag_14",
      "tag_mod_2_0",
      "tag_mod_3_2"
    ],
    "favorited": false,
    "favoritesCount": 0
  }
}
```
```
POST /articles

{
  "article": {
    "title": "title",
    "description": "description",
    "body": "body",
    "tagList": [
      "9rmgdt",
      "tag_15",
      "tag_mod_2_1",
      "tag_mod_3_0"
    ]
  }
}
```
```
200 OK

{
  "article": {
    "slug": "title-tmhkcc",
    "title": "title",
    "description": "description",
    "body": "body",
    "createdAt": 1623725530811,
    "updatedAt": 1623725530811,
    "author": {
      "username": "author-vr9rct",
      "bio": "",
      "image": "",
      "following": false
    },
    "tagList": [
      "9rmgdt",
      "tag_15",
      "tag_mod_2_1",
      "tag_mod_3_0"
    ],
    "favorited": false,
    "favoritesCount": 0
  }
}
```
```
POST /articles

{
  "article": {
    "title": "title",
    "description": "description",
    "body": "body",
    "tagList": [
      "tcu80x",
      "tag_16",
      "tag_mod_2_0",
      "tag_mod_3_1"
    ]
  }
}
```
```
200 OK

{
  "article": {
    "slug": "title-w0lupu",
    "title": "title",
    "description": "description",
    "body": "body",
    "createdAt": 1623725530832,
    "updatedAt": 1623725530832,
    "author": {
      "username": "authoress-7ue3fa",
      "bio": "",
      "image": "",
      "following": false
    },
    "tagList": [
      "tcu80x",
      "tag_16",
      "tag_mod_2_0",
      "tag_mod_3_1"
    ],
    "favorited": false,
    "favoritesCount": 0
  }
}
```
```
POST /articles

{
  "article": {
    "title": "title",
    "description": "description",
    "body": "body",
    "tagList": [
      "fh3cwy",
      "tag_17",
      "tag_mod_2_1",
      "tag_mod_3_2"
    ]
  }
}
```
```
200 OK

{
  "article": {
    "slug": "title-y6idug",
    "title": "title",
    "description": "description",
    "body": "body",
    "createdAt": 1623725530853,
    "updatedAt": 1623725530853,
    "author": {
      "username": "author-vr9rct",
      "bio": "",
      "image": "",
      "following": false
    },
    "tagList": [
      "fh3cwy",
      "tag_17",
      "tag_mod_2_1",
      "tag_mod_3_2"
    ],
    "favorited": false,
    "favoritesCount": 0
  }
}
```
```
POST /articles

{
  "article": {
    "title": "title",
    "description": "description",
    "body": "body",
    "tagList": [
      "bpq81d",
      "tag_18",
      "tag_mod_2_0",
      "tag_mod_3_0"
    ]
  }
}
```
```
200 OK

{
  "article": {
    "slug": "title-j2rzbq",
    "title": "title",
    "description": "description",
    "body": "body",
    "createdAt": 1623725530875,
    "updatedAt": 1623725530875,
    "author": {
      "username": "authoress-7ue3fa",
      "bio": "",
      "image": "",
      "following": false
    },
    "tagList": [
      "bpq81d",
      "tag_18",
      "tag_mod_2_0",
      "tag_mod_3_0"
    ],
    "favorited": false,
    "favoritesCount": 0
  }
}
```
```
POST /articles

{
  "article": {
    "title": "title",
    "description": "description",
    "body": "body",
    "tagList": [
      "ktga10",
      "tag_19",
      "tag_mod_2_1",
      "tag_mod_3_1"
    ]
  }
}
```
```
200 OK

{
  "article": {
    "slug": "title-poukai",
    "title": "title",
    "description": "description",
    "body": "body",
    "createdAt": 1623725530894,
    "updatedAt": 1623725530894,
    "author": {
      "username": "author-vr9rct",
      "bio": "",
      "image": "",
      "following": false
    },
    "tagList": [
      "ktga10",
      "tag_19",
      "tag_mod_2_1",
      "tag_mod_3_1"
    ],
    "favorited": false,
    "favoritesCount": 0
  }
}
```
### should list articles
```
GET /articles
```
```
200 OK

{
  "articles": [
    {
      "tagList": [
        "ktga10",
        "tag_19",
        "tag_mod_2_1",
        "tag_mod_3_1"
      ],
      "createdAt": 1623725530894,
      "author": {
        "username": "author-vr9rct",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-poukai",
      "updatedAt": 1623725530894,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "bpq81d",
        "tag_18",
        "tag_mod_2_0",
        "tag_mod_3_0"
      ],
      "createdAt": 1623725530875,
      "author": {
        "username": "authoress-7ue3fa",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-j2rzbq",
      "updatedAt": 1623725530875,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "fh3cwy",
        "tag_17",
        "tag_mod_2_1",
        "tag_mod_3_2"
      ],
      "createdAt": 1623725530853,
      "author": {
        "username": "author-vr9rct",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-y6idug",
      "updatedAt": 1623725530853,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "tag_16",
        "tag_mod_2_0",
        "tag_mod_3_1",
        "tcu80x"
      ],
      "createdAt": 1623725530832,
      "author": {
        "username": "authoress-7ue3fa",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-w0lupu",
      "updatedAt": 1623725530832,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "9rmgdt",
        "tag_15",
        "tag_mod_2_1",
        "tag_mod_3_0"
      ],
      "createdAt": 1623725530811,
      "author": {
        "username": "author-vr9rct",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-tmhkcc",
      "updatedAt": 1623725530811,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "irafm0",
        "tag_14",
        "tag_mod_2_0",
        "tag_mod_3_2"
      ],
      "createdAt": 1623725530784,
      "author": {
        "username": "authoress-7ue3fa",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-wfuwas",
      "updatedAt": 1623725530784,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "s0ucyw",
        "tag_13",
        "tag_mod_2_1",
        "tag_mod_3_1"
      ],
      "createdAt": 1623725530760,
      "author": {
        "username": "author-vr9rct",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-5cn7ah",
      "updatedAt": 1623725530760,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "tag_12",
        "tag_mod_2_0",
        "tag_mod_3_0",
        "uhm4dq"
      ],
      "createdAt": 1623725530741,
      "author": {
        "username": "authoress-7ue3fa",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-b8ovm8",
      "updatedAt": 1623725530741,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "jvhyax",
        "tag_11",
        "tag_mod_2_1",
        "tag_mod_3_2"
      ],
      "createdAt": 1623725530721,
      "author": {
        "username": "author-vr9rct",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title--z5g3tz",
      "updatedAt": 1623725530721,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "ij6ibg",
        "tag_10",
        "tag_mod_2_0",
        "tag_mod_3_1"
      ],
      "createdAt": 1623725530702,
      "author": {
        "username": "authoress-7ue3fa",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-kiggu",
      "updatedAt": 1623725530702,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "8j4vb7",
        "tag_9",
        "tag_mod_2_1",
        "tag_mod_3_0"
      ],
      "createdAt": 1623725530677,
      "author": {
        "username": "author-vr9rct",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-e5f1ob",
      "updatedAt": 1623725530677,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "tag_8",
        "tag_mod_2_0",
        "tag_mod_3_2",
        "ugh70l"
      ],
      "createdAt": 1623725530654,
      "author": {
        "username": "authoress-7ue3fa",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-bjnnj2",
      "updatedAt": 1623725530654,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "7cuze9",
        "tag_7",
        "tag_mod_2_1",
        "tag_mod_3_1"
      ],
      "createdAt": 1623725530637,
      "author": {
        "username": "author-vr9rct",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-ygselz",
      "updatedAt": 1623725530637,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "qkzdu3",
        "tag_6",
        "tag_mod_2_0",
        "tag_mod_3_0"
      ],
      "createdAt": 1623725530610,
      "author": {
        "username": "authoress-7ue3fa",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-j6w6d2",
      "updatedAt": 1623725530610,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "qjcgr0",
        "tag_5",
        "tag_mod_2_1",
        "tag_mod_3_2"
      ],
      "createdAt": 1623725530590,
      "author": {
        "username": "author-vr9rct",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-2bomgm",
      "updatedAt": 1623725530590,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "tag_4",
        "tag_mod_2_0",
        "tag_mod_3_1",
        "xhvh6v"
      ],
      "createdAt": 1623725530570,
      "author": {
        "username": "authoress-7ue3fa",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-jrl2st",
      "updatedAt": 1623725530570,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "60kdar",
        "tag_3",
        "tag_mod_2_1",
        "tag_mod_3_0"
      ],
      "createdAt": 1623725530549,
      "author": {
        "username": "author-vr9rct",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-qyzp01",
      "updatedAt": 1623725530549,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "dv9nw3",
        "tag_2",
        "tag_mod_2_0",
        "tag_mod_3_2"
      ],
      "createdAt": 1623725530530,
      "author": {
        "username": "authoress-7ue3fa",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-5ejhwo",
      "updatedAt": 1623725530530,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "tag_1",
        "tag_mod_2_1",
        "tag_mod_3_1",
        "z4lwzp"
      ],
      "createdAt": 1623725530506,
      "author": {
        "username": "author-vr9rct",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-rpr5l8",
      "updatedAt": 1623725530506,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "tag_0",
        "tag_mod_2_0",
        "tag_mod_3_0",
        "vls20i"
      ],
      "createdAt": 1623725530467,
      "author": {
        "username": "authoress-7ue3fa",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-cw03ww",
      "updatedAt": 1623725530467,
      "favoritesCount": 0,
      "favorited": false
    }
  ]
}
```
### should list articles with tag
```
GET /articles?tag=tag_7
```
```
200 OK

{
  "articles": [
    {
      "tagList": [
        "7cuze9",
        "tag_7",
        "tag_mod_2_1",
        "tag_mod_3_1"
      ],
      "createdAt": 1623725530637,
      "author": {
        "username": "author-vr9rct",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-ygselz",
      "updatedAt": 1623725530637,
      "favoritesCount": 0,
      "favorited": false
    }
  ]
}
```
```
GET /articles?tag=tag_mod_3_2
```
```
200 OK

{
  "articles": [
    {
      "tagList": [
        "fh3cwy",
        "tag_17",
        "tag_mod_2_1",
        "tag_mod_3_2"
      ],
      "createdAt": 1623725530853,
      "author": {
        "username": "author-vr9rct",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-y6idug",
      "updatedAt": 1623725530853,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "irafm0",
        "tag_14",
        "tag_mod_2_0",
        "tag_mod_3_2"
      ],
      "createdAt": 1623725530784,
      "author": {
        "username": "authoress-7ue3fa",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-wfuwas",
      "updatedAt": 1623725530784,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "jvhyax",
        "tag_11",
        "tag_mod_2_1",
        "tag_mod_3_2"
      ],
      "createdAt": 1623725530721,
      "author": {
        "username": "author-vr9rct",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title--z5g3tz",
      "updatedAt": 1623725530721,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "tag_8",
        "tag_mod_2_0",
        "tag_mod_3_2",
        "ugh70l"
      ],
      "createdAt": 1623725530654,
      "author": {
        "username": "authoress-7ue3fa",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-bjnnj2",
      "updatedAt": 1623725530654,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "qjcgr0",
        "tag_5",
        "tag_mod_2_1",
        "tag_mod_3_2"
      ],
      "createdAt": 1623725530590,
      "author": {
        "username": "author-vr9rct",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-2bomgm",
      "updatedAt": 1623725530590,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "dv9nw3",
        "tag_2",
        "tag_mod_2_0",
        "tag_mod_3_2"
      ],
      "createdAt": 1623725530530,
      "author": {
        "username": "authoress-7ue3fa",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-5ejhwo",
      "updatedAt": 1623725530530,
      "favoritesCount": 0,
      "favorited": false
    }
  ]
}
```
### should list articles by author
```
GET /articles?author=authoress-7ue3fa
```
```
200 OK

{
  "articles": [
    {
      "tagList": [
        "bpq81d",
        "tag_18",
        "tag_mod_2_0",
        "tag_mod_3_0"
      ],
      "createdAt": 1623725530875,
      "author": {
        "username": "authoress-7ue3fa",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-j2rzbq",
      "updatedAt": 1623725530875,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "tag_16",
        "tag_mod_2_0",
        "tag_mod_3_1",
        "tcu80x"
      ],
      "createdAt": 1623725530832,
      "author": {
        "username": "authoress-7ue3fa",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-w0lupu",
      "updatedAt": 1623725530832,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "irafm0",
        "tag_14",
        "tag_mod_2_0",
        "tag_mod_3_2"
      ],
      "createdAt": 1623725530784,
      "author": {
        "username": "authoress-7ue3fa",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-wfuwas",
      "updatedAt": 1623725530784,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "tag_12",
        "tag_mod_2_0",
        "tag_mod_3_0",
        "uhm4dq"
      ],
      "createdAt": 1623725530741,
      "author": {
        "username": "authoress-7ue3fa",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-b8ovm8",
      "updatedAt": 1623725530741,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "ij6ibg",
        "tag_10",
        "tag_mod_2_0",
        "tag_mod_3_1"
      ],
      "createdAt": 1623725530702,
      "author": {
        "username": "authoress-7ue3fa",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-kiggu",
      "updatedAt": 1623725530702,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "tag_8",
        "tag_mod_2_0",
        "tag_mod_3_2",
        "ugh70l"
      ],
      "createdAt": 1623725530654,
      "author": {
        "username": "authoress-7ue3fa",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-bjnnj2",
      "updatedAt": 1623725530654,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "qkzdu3",
        "tag_6",
        "tag_mod_2_0",
        "tag_mod_3_0"
      ],
      "createdAt": 1623725530610,
      "author": {
        "username": "authoress-7ue3fa",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-j6w6d2",
      "updatedAt": 1623725530610,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "tag_4",
        "tag_mod_2_0",
        "tag_mod_3_1",
        "xhvh6v"
      ],
      "createdAt": 1623725530570,
      "author": {
        "username": "authoress-7ue3fa",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-jrl2st",
      "updatedAt": 1623725530570,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "dv9nw3",
        "tag_2",
        "tag_mod_2_0",
        "tag_mod_3_2"
      ],
      "createdAt": 1623725530530,
      "author": {
        "username": "authoress-7ue3fa",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-5ejhwo",
      "updatedAt": 1623725530530,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "tag_0",
        "tag_mod_2_0",
        "tag_mod_3_0",
        "vls20i"
      ],
      "createdAt": 1623725530467,
      "author": {
        "username": "authoress-7ue3fa",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-cw03ww",
      "updatedAt": 1623725530467,
      "favoritesCount": 0,
      "favorited": false
    }
  ]
}
```
### should list articles favorited by user
```
GET /articles?favorited=non-author-wuomm1
```
```
200 OK

{
  "articles": []
}
```
### should list articles by limit/offset
```
GET /articles?author=author-vr9rct&limit=2
```
```
200 OK

{
  "articles": [
    {
      "tagList": [
        "ktga10",
        "tag_19",
        "tag_mod_2_1",
        "tag_mod_3_1"
      ],
      "createdAt": 1623725530894,
      "author": {
        "username": "author-vr9rct",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-poukai",
      "updatedAt": 1623725530894,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "fh3cwy",
        "tag_17",
        "tag_mod_2_1",
        "tag_mod_3_2"
      ],
      "createdAt": 1623725530853,
      "author": {
        "username": "author-vr9rct",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-y6idug",
      "updatedAt": 1623725530853,
      "favoritesCount": 0,
      "favorited": false
    }
  ]
}
```
```
GET /articles?author=author-vr9rct&limit=2&offset=2
```
```
200 OK

{
  "articles": [
    {
      "tagList": [
        "9rmgdt",
        "tag_15",
        "tag_mod_2_1",
        "tag_mod_3_0"
      ],
      "createdAt": 1623725530811,
      "author": {
        "username": "author-vr9rct",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-tmhkcc",
      "updatedAt": 1623725530811,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "s0ucyw",
        "tag_13",
        "tag_mod_2_1",
        "tag_mod_3_1"
      ],
      "createdAt": 1623725530760,
      "author": {
        "username": "author-vr9rct",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-5cn7ah",
      "updatedAt": 1623725530760,
      "favoritesCount": 0,
      "favorited": false
    }
  ]
}
```
### should list articles when authenticated
```
GET /articles
```
```
200 OK

{
  "articles": [
    {
      "tagList": [
        "ktga10",
        "tag_19",
        "tag_mod_2_1",
        "tag_mod_3_1"
      ],
      "createdAt": 1623725530894,
      "author": {
        "username": "author-vr9rct",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-poukai",
      "updatedAt": 1623725530894,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "bpq81d",
        "tag_18",
        "tag_mod_2_0",
        "tag_mod_3_0"
      ],
      "createdAt": 1623725530875,
      "author": {
        "username": "authoress-7ue3fa",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-j2rzbq",
      "updatedAt": 1623725530875,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "fh3cwy",
        "tag_17",
        "tag_mod_2_1",
        "tag_mod_3_2"
      ],
      "createdAt": 1623725530853,
      "author": {
        "username": "author-vr9rct",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-y6idug",
      "updatedAt": 1623725530853,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "tag_16",
        "tag_mod_2_0",
        "tag_mod_3_1",
        "tcu80x"
      ],
      "createdAt": 1623725530832,
      "author": {
        "username": "authoress-7ue3fa",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-w0lupu",
      "updatedAt": 1623725530832,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "9rmgdt",
        "tag_15",
        "tag_mod_2_1",
        "tag_mod_3_0"
      ],
      "createdAt": 1623725530811,
      "author": {
        "username": "author-vr9rct",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-tmhkcc",
      "updatedAt": 1623725530811,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "irafm0",
        "tag_14",
        "tag_mod_2_0",
        "tag_mod_3_2"
      ],
      "createdAt": 1623725530784,
      "author": {
        "username": "authoress-7ue3fa",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-wfuwas",
      "updatedAt": 1623725530784,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "s0ucyw",
        "tag_13",
        "tag_mod_2_1",
        "tag_mod_3_1"
      ],
      "createdAt": 1623725530760,
      "author": {
        "username": "author-vr9rct",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-5cn7ah",
      "updatedAt": 1623725530760,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "tag_12",
        "tag_mod_2_0",
        "tag_mod_3_0",
        "uhm4dq"
      ],
      "createdAt": 1623725530741,
      "author": {
        "username": "authoress-7ue3fa",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-b8ovm8",
      "updatedAt": 1623725530741,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "jvhyax",
        "tag_11",
        "tag_mod_2_1",
        "tag_mod_3_2"
      ],
      "createdAt": 1623725530721,
      "author": {
        "username": "author-vr9rct",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title--z5g3tz",
      "updatedAt": 1623725530721,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "ij6ibg",
        "tag_10",
        "tag_mod_2_0",
        "tag_mod_3_1"
      ],
      "createdAt": 1623725530702,
      "author": {
        "username": "authoress-7ue3fa",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-kiggu",
      "updatedAt": 1623725530702,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "8j4vb7",
        "tag_9",
        "tag_mod_2_1",
        "tag_mod_3_0"
      ],
      "createdAt": 1623725530677,
      "author": {
        "username": "author-vr9rct",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-e5f1ob",
      "updatedAt": 1623725530677,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "tag_8",
        "tag_mod_2_0",
        "tag_mod_3_2",
        "ugh70l"
      ],
      "createdAt": 1623725530654,
      "author": {
        "username": "authoress-7ue3fa",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-bjnnj2",
      "updatedAt": 1623725530654,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "7cuze9",
        "tag_7",
        "tag_mod_2_1",
        "tag_mod_3_1"
      ],
      "createdAt": 1623725530637,
      "author": {
        "username": "author-vr9rct",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-ygselz",
      "updatedAt": 1623725530637,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "qkzdu3",
        "tag_6",
        "tag_mod_2_0",
        "tag_mod_3_0"
      ],
      "createdAt": 1623725530610,
      "author": {
        "username": "authoress-7ue3fa",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-j6w6d2",
      "updatedAt": 1623725530610,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "qjcgr0",
        "tag_5",
        "tag_mod_2_1",
        "tag_mod_3_2"
      ],
      "createdAt": 1623725530590,
      "author": {
        "username": "author-vr9rct",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-2bomgm",
      "updatedAt": 1623725530590,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "tag_4",
        "tag_mod_2_0",
        "tag_mod_3_1",
        "xhvh6v"
      ],
      "createdAt": 1623725530570,
      "author": {
        "username": "authoress-7ue3fa",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-jrl2st",
      "updatedAt": 1623725530570,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "60kdar",
        "tag_3",
        "tag_mod_2_1",
        "tag_mod_3_0"
      ],
      "createdAt": 1623725530549,
      "author": {
        "username": "author-vr9rct",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-qyzp01",
      "updatedAt": 1623725530549,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "dv9nw3",
        "tag_2",
        "tag_mod_2_0",
        "tag_mod_3_2"
      ],
      "createdAt": 1623725530530,
      "author": {
        "username": "authoress-7ue3fa",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-5ejhwo",
      "updatedAt": 1623725530530,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "tag_1",
        "tag_mod_2_1",
        "tag_mod_3_1",
        "z4lwzp"
      ],
      "createdAt": 1623725530506,
      "author": {
        "username": "author-vr9rct",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-rpr5l8",
      "updatedAt": 1623725530506,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "tag_0",
        "tag_mod_2_0",
        "tag_mod_3_0",
        "vls20i"
      ],
      "createdAt": 1623725530467,
      "author": {
        "username": "authoress-7ue3fa",
        "bio": "",
        "image": "",
        "following": false
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-cw03ww",
      "updatedAt": 1623725530467,
      "favoritesCount": 0,
      "favorited": false
    }
  ]
}
```
### should disallow multiple of author/tag/favorited
```
GET /articles?tag=foo&author=bar
```
```
GET /articles?author=foo&favorited=bar
```
```
GET /articles?favorited=foo&tag=bar
```
## Feed
### should get feed
```
GET /articles/feed
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Only one of these can be specified: [tag, author, favorited]"
    ]
  }
}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Only one of these can be specified: [tag, author, favorited]"
    ]
  }
}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Only one of these can be specified: [tag, author, favorited]"
    ]
  }
}
```
```
200 OK

{
  "articles": []
}
```
```
POST /profiles/authoress-7ue3fa/follow

{}
```
```
200 OK

{
  "profile": {
    "username": "authoress-7ue3fa",
    "bio": "",
    "image": "",
    "following": true
  }
}
```
```
GET /articles/feed
```
```
200 OK

{
  "articles": [
    {
      "tagList": [
        "bpq81d",
        "tag_18",
        "tag_mod_2_0",
        "tag_mod_3_0"
      ],
      "createdAt": 1623725530875,
      "author": {
        "username": "authoress-7ue3fa",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-j2rzbq",
      "updatedAt": 1623725530875,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "tag_16",
        "tag_mod_2_0",
        "tag_mod_3_1",
        "tcu80x"
      ],
      "createdAt": 1623725530832,
      "author": {
        "username": "authoress-7ue3fa",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-w0lupu",
      "updatedAt": 1623725530832,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "irafm0",
        "tag_14",
        "tag_mod_2_0",
        "tag_mod_3_2"
      ],
      "createdAt": 1623725530784,
      "author": {
        "username": "authoress-7ue3fa",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-wfuwas",
      "updatedAt": 1623725530784,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "tag_12",
        "tag_mod_2_0",
        "tag_mod_3_0",
        "uhm4dq"
      ],
      "createdAt": 1623725530741,
      "author": {
        "username": "authoress-7ue3fa",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-b8ovm8",
      "updatedAt": 1623725530741,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "ij6ibg",
        "tag_10",
        "tag_mod_2_0",
        "tag_mod_3_1"
      ],
      "createdAt": 1623725530702,
      "author": {
        "username": "authoress-7ue3fa",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-kiggu",
      "updatedAt": 1623725530702,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "tag_8",
        "tag_mod_2_0",
        "tag_mod_3_2",
        "ugh70l"
      ],
      "createdAt": 1623725530654,
      "author": {
        "username": "authoress-7ue3fa",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-bjnnj2",
      "updatedAt": 1623725530654,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "qkzdu3",
        "tag_6",
        "tag_mod_2_0",
        "tag_mod_3_0"
      ],
      "createdAt": 1623725530610,
      "author": {
        "username": "authoress-7ue3fa",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-j6w6d2",
      "updatedAt": 1623725530610,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "tag_4",
        "tag_mod_2_0",
        "tag_mod_3_1",
        "xhvh6v"
      ],
      "createdAt": 1623725530570,
      "author": {
        "username": "authoress-7ue3fa",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-jrl2st",
      "updatedAt": 1623725530570,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "dv9nw3",
        "tag_2",
        "tag_mod_2_0",
        "tag_mod_3_2"
      ],
      "createdAt": 1623725530530,
      "author": {
        "username": "authoress-7ue3fa",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-5ejhwo",
      "updatedAt": 1623725530530,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "tag_0",
        "tag_mod_2_0",
        "tag_mod_3_0",
        "vls20i"
      ],
      "createdAt": 1623725530467,
      "author": {
        "username": "authoress-7ue3fa",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-cw03ww",
      "updatedAt": 1623725530467,
      "favoritesCount": 0,
      "favorited": false
    }
  ]
}
```
```
POST /profiles/author-vr9rct/follow

{}
```
```
200 OK

{
  "profile": {
    "username": "author-vr9rct",
    "bio": "",
    "image": "",
    "following": true
  }
}
```
```
GET /articles/feed
```
```
200 OK

{
  "articles": [
    {
      "tagList": [
        "ktga10",
        "tag_19",
        "tag_mod_2_1",
        "tag_mod_3_1"
      ],
      "createdAt": 1623725530894,
      "author": {
        "username": "author-vr9rct",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-poukai",
      "updatedAt": 1623725530894,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "bpq81d",
        "tag_18",
        "tag_mod_2_0",
        "tag_mod_3_0"
      ],
      "createdAt": 1623725530875,
      "author": {
        "username": "authoress-7ue3fa",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-j2rzbq",
      "updatedAt": 1623725530875,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "fh3cwy",
        "tag_17",
        "tag_mod_2_1",
        "tag_mod_3_2"
      ],
      "createdAt": 1623725530853,
      "author": {
        "username": "author-vr9rct",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-y6idug",
      "updatedAt": 1623725530853,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "tag_16",
        "tag_mod_2_0",
        "tag_mod_3_1",
        "tcu80x"
      ],
      "createdAt": 1623725530832,
      "author": {
        "username": "authoress-7ue3fa",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-w0lupu",
      "updatedAt": 1623725530832,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "9rmgdt",
        "tag_15",
        "tag_mod_2_1",
        "tag_mod_3_0"
      ],
      "createdAt": 1623725530811,
      "author": {
        "username": "author-vr9rct",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-tmhkcc",
      "updatedAt": 1623725530811,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "irafm0",
        "tag_14",
        "tag_mod_2_0",
        "tag_mod_3_2"
      ],
      "createdAt": 1623725530784,
      "author": {
        "username": "authoress-7ue3fa",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-wfuwas",
      "updatedAt": 1623725530784,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "s0ucyw",
        "tag_13",
        "tag_mod_2_1",
        "tag_mod_3_1"
      ],
      "createdAt": 1623725530760,
      "author": {
        "username": "author-vr9rct",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-5cn7ah",
      "updatedAt": 1623725530760,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "tag_12",
        "tag_mod_2_0",
        "tag_mod_3_0",
        "uhm4dq"
      ],
      "createdAt": 1623725530741,
      "author": {
        "username": "authoress-7ue3fa",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-b8ovm8",
      "updatedAt": 1623725530741,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "jvhyax",
        "tag_11",
        "tag_mod_2_1",
        "tag_mod_3_2"
      ],
      "createdAt": 1623725530721,
      "author": {
        "username": "author-vr9rct",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title--z5g3tz",
      "updatedAt": 1623725530721,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "ij6ibg",
        "tag_10",
        "tag_mod_2_0",
        "tag_mod_3_1"
      ],
      "createdAt": 1623725530702,
      "author": {
        "username": "authoress-7ue3fa",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-kiggu",
      "updatedAt": 1623725530702,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "8j4vb7",
        "tag_9",
        "tag_mod_2_1",
        "tag_mod_3_0"
      ],
      "createdAt": 1623725530677,
      "author": {
        "username": "author-vr9rct",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-e5f1ob",
      "updatedAt": 1623725530677,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "tag_8",
        "tag_mod_2_0",
        "tag_mod_3_2",
        "ugh70l"
      ],
      "createdAt": 1623725530654,
      "author": {
        "username": "authoress-7ue3fa",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-bjnnj2",
      "updatedAt": 1623725530654,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "7cuze9",
        "tag_7",
        "tag_mod_2_1",
        "tag_mod_3_1"
      ],
      "createdAt": 1623725530637,
      "author": {
        "username": "author-vr9rct",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-ygselz",
      "updatedAt": 1623725530637,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "qkzdu3",
        "tag_6",
        "tag_mod_2_0",
        "tag_mod_3_0"
      ],
      "createdAt": 1623725530610,
      "author": {
        "username": "authoress-7ue3fa",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-j6w6d2",
      "updatedAt": 1623725530610,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "qjcgr0",
        "tag_5",
        "tag_mod_2_1",
        "tag_mod_3_2"
      ],
      "createdAt": 1623725530590,
      "author": {
        "username": "author-vr9rct",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-2bomgm",
      "updatedAt": 1623725530590,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "tag_4",
        "tag_mod_2_0",
        "tag_mod_3_1",
        "xhvh6v"
      ],
      "createdAt": 1623725530570,
      "author": {
        "username": "authoress-7ue3fa",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-jrl2st",
      "updatedAt": 1623725530570,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "60kdar",
        "tag_3",
        "tag_mod_2_1",
        "tag_mod_3_0"
      ],
      "createdAt": 1623725530549,
      "author": {
        "username": "author-vr9rct",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-qyzp01",
      "updatedAt": 1623725530549,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "dv9nw3",
        "tag_2",
        "tag_mod_2_0",
        "tag_mod_3_2"
      ],
      "createdAt": 1623725530530,
      "author": {
        "username": "authoress-7ue3fa",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-5ejhwo",
      "updatedAt": 1623725530530,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "tag_1",
        "tag_mod_2_1",
        "tag_mod_3_1",
        "z4lwzp"
      ],
      "createdAt": 1623725530506,
      "author": {
        "username": "author-vr9rct",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-rpr5l8",
      "updatedAt": 1623725530506,
      "favoritesCount": 0,
      "favorited": false
    },
    {
      "tagList": [
        "tag_0",
        "tag_mod_2_0",
        "tag_mod_3_0",
        "vls20i"
      ],
      "createdAt": 1623725530467,
      "author": {
        "username": "authoress-7ue3fa",
        "bio": "",
        "image": "",
        "following": true
      },
      "description": "description",
      "title": "title",
      "body": "body",
      "slug": "title-cw03ww",
      "updatedAt": 1623725530467,
      "favoritesCount": 0,
      "favorited": false
    }
  ]
}
```
### should disallow unauthenticated feed
```
GET /articles/feed
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Must be logged in."
    ]
  }
}
```
## Tags
### should get tags
```
GET /tags
```
```
200 OK

{
  "tags": [
    "tag_4",
    "tag_mod_2_0",
    "tag_mod_3_1",
    "xhvh6v",
    "8j4vb7",
    "tag_9",
    "tag_mod_2_1",
    "tag_mod_3_0",
    "tag_1",
    "z4lwzp",
    "tag_a",
    "tag_b",
    "s0ucyw",
    "tag_13",
    "60kdar",
    "tag_3",
    "tag_16",
    "tcu80x",
    "9rmgdt",
    "tag_15",
    "bpq81d",
    "tag_18",
    "tag_12",
    "uhm4dq",
    "dv9nw3",
    "tag_2",
    "tag_mod_3_2",
    "qkzdu3",
    "tag_6",
    "tag_8",
    "ugh70l",
    "qjcgr0",
    "tag_5",
    "jvhyax",
    "tag_11",
    "fh3cwy",
    "tag_17",
    "ktga10",
    "tag_19",
    "tag_0",
    "vls20i",
    "7cuze9",
    "tag_7",
    "ij6ibg",
    "tag_10",
    "irafm0",
    "tag_14"
  ]
}
```
# Comment
```
POST /users

{
  "user": {
    "email": "author-domy8c@email.com",
    "username": "author-domy8c",
    "password": "password"
  }
}
```
```
200 OK

{
  "user": {
    "email": "author-domy8c@email.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImF1dGhvci1kb215OGMiLCJpYXQiOjE2MjM3MjU1MzEsImV4cCI6MTYyMzg5ODMzMX0.zmy1SUbn4GIG9Fm0Jjh8CfZhmAaAVCd9tJ_wbqqAycg",
    "username": "author-domy8c",
    "bio": "",
    "image": ""
  }
}
```
```
POST /users

{
  "user": {
    "email": "commenter-p9xlj3@email.com",
    "username": "commenter-p9xlj3",
    "password": "password"
  }
}
```
```
200 OK

{
  "user": {
    "email": "commenter-p9xlj3@email.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImNvbW1lbnRlci1wOXhsajMiLCJpYXQiOjE2MjM3MjU1MzEsImV4cCI6MTYyMzg5ODMzMX0._ABZlzlGPeWlEGxpVTeq7H3nBfZ_mdmsXhs-YRCUFf0",
    "username": "commenter-p9xlj3",
    "bio": "",
    "image": ""
  }
}
```
```
POST /articles

{
  "article": {
    "title": "title",
    "description": "description",
    "body": "body"
  }
}
```
```
200 OK

{
  "article": {
    "slug": "title-lbtdsj",
    "title": "title",
    "description": "description",
    "body": "body",
    "createdAt": 1623725531645,
    "updatedAt": 1623725531645,
    "author": {
      "username": "author-domy8c",
      "bio": "",
      "image": "",
      "following": false
    },
    "tagList": [],
    "favorited": false,
    "favoritesCount": 0
  }
}
```
## Create
### should create comment
```
POST /articles/title-lbtdsj/comments

{
  "comment": {
    "body": "test comment k3fkj7"
  }
}
```
```
200 OK

{
  "comment": {
    "id": "d151f97e-ab5c-4617-864e-60033ea27440",
    "slug": "title-lbtdsj",
    "body": "test comment k3fkj7",
    "createdAt": 1623725531672,
    "updatedAt": 1623725531672,
    "author": {
      "username": "commenter-p9xlj3",
      "bio": "",
      "image": "",
      "following": false
    }
  }
}
```
```
POST /articles/title-lbtdsj/comments

{
  "comment": {
    "body": "test comment gl2tf8"
  }
}
```
```
200 OK

{
  "comment": {
    "id": "41c7214b-c28c-4782-b4e8-ac3f17973011",
    "slug": "title-lbtdsj",
    "body": "test comment gl2tf8",
    "createdAt": 1623725531707,
    "updatedAt": 1623725531707,
    "author": {
      "username": "commenter-p9xlj3",
      "bio": "",
      "image": "",
      "following": false
    }
  }
}
```
```
POST /articles/title-lbtdsj/comments

{
  "comment": {
    "body": "test comment 4r1mzr"
  }
}
```
```
200 OK

{
  "comment": {
    "id": "d3b72a3d-1b28-4646-95a0-a4411e8fd8be",
    "slug": "title-lbtdsj",
    "body": "test comment 4r1mzr",
    "createdAt": 1623725531727,
    "updatedAt": 1623725531727,
    "author": {
      "username": "commenter-p9xlj3",
      "bio": "",
      "image": "",
      "following": false
    }
  }
}
```
```
POST /articles/title-lbtdsj/comments

{
  "comment": {
    "body": "test comment b8ugzw"
  }
}
```
```
200 OK

{
  "comment": {
    "id": "fe5d2f10-fc3d-49ae-a398-69e3fb1856d6",
    "slug": "title-lbtdsj",
    "body": "test comment b8ugzw",
    "createdAt": 1623725531749,
    "updatedAt": 1623725531749,
    "author": {
      "username": "commenter-p9xlj3",
      "bio": "",
      "image": "",
      "following": false
    }
  }
}
```
```
POST /articles/title-lbtdsj/comments

{
  "comment": {
    "body": "test comment 95o1bk"
  }
}
```
```
200 OK

{
  "comment": {
    "id": "73438052-8210-4904-aa08-0288108d978e",
    "slug": "title-lbtdsj",
    "body": "test comment 95o1bk",
    "createdAt": 1623725531770,
    "updatedAt": 1623725531770,
    "author": {
      "username": "commenter-p9xlj3",
      "bio": "",
      "image": "",
      "following": false
    }
  }
}
```
```
POST /articles/title-lbtdsj/comments

{
  "comment": {
    "body": "test comment mf0pcu"
  }
}
```
```
200 OK

{
  "comment": {
    "id": "7c232494-4c08-4b3e-b32c-f38136b0a6d5",
    "slug": "title-lbtdsj",
    "body": "test comment mf0pcu",
    "createdAt": 1623725531801,
    "updatedAt": 1623725531801,
    "author": {
      "username": "commenter-p9xlj3",
      "bio": "",
      "image": "",
      "following": false
    }
  }
}
```
```
POST /articles/title-lbtdsj/comments

{
  "comment": {
    "body": "test comment 620egq"
  }
}
```
```
200 OK

{
  "comment": {
    "id": "09a6c8cb-4e94-49ed-bdf2-26d39ca44646",
    "slug": "title-lbtdsj",
    "body": "test comment 620egq",
    "createdAt": 1623725531826,
    "updatedAt": 1623725531826,
    "author": {
      "username": "commenter-p9xlj3",
      "bio": "",
      "image": "",
      "following": false
    }
  }
}
```
```
POST /articles/title-lbtdsj/comments

{
  "comment": {
    "body": "test comment 72n3pz"
  }
}
```
```
200 OK

{
  "comment": {
    "id": "3aa87531-6d01-4208-ba23-9cdf88c65464",
    "slug": "title-lbtdsj",
    "body": "test comment 72n3pz",
    "createdAt": 1623725531855,
    "updatedAt": 1623725531855,
    "author": {
      "username": "commenter-p9xlj3",
      "bio": "",
      "image": "",
      "following": false
    }
  }
}
```
```
POST /articles/title-lbtdsj/comments

{
  "comment": {
    "body": "test comment qwn4tl"
  }
}
```
```
200 OK

{
  "comment": {
    "id": "1437396b-6830-44c0-b781-5b3099f7ebba",
    "slug": "title-lbtdsj",
    "body": "test comment qwn4tl",
    "createdAt": 1623725531880,
    "updatedAt": 1623725531880,
    "author": {
      "username": "commenter-p9xlj3",
      "bio": "",
      "image": "",
      "following": false
    }
  }
}
```
```
POST /articles/title-lbtdsj/comments

{
  "comment": {
    "body": "test comment asu2it"
  }
}
```
```
200 OK

{
  "comment": {
    "id": "ff177d28-7645-45d1-934c-405c0dc92483",
    "slug": "title-lbtdsj",
    "body": "test comment asu2it",
    "createdAt": 1623725531920,
    "updatedAt": 1623725531920,
    "author": {
      "username": "commenter-p9xlj3",
      "bio": "",
      "image": "",
      "following": false
    }
  }
}
```
### should disallow unauthenticated user
```
POST /articles/title-lbtdsj/comments

{}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Must be logged in."
    ]
  }
}
```
### should enforce comment body
```
POST /articles/title-lbtdsj/comments

{}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Comment must be specified."
    ]
  }
}
```
### should disallow non-existent article
```
POST /articles/foobar/comments

{
  "comment": {
    "body": "test comment 1nreqy"
  }
}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Article not found: [foobar]"
    ]
  }
}
```
## Get
### should get all comments for article
```
GET /articles/title-lbtdsj/comments
```
```
200 OK

{
  "comments": [
    {
      "createdAt": 1623725531672,
      "id": "d151f97e-ab5c-4617-864e-60033ea27440",
      "body": "test comment k3fkj7",
      "slug": "title-lbtdsj",
      "author": {
        "username": "commenter-p9xlj3",
        "bio": "",
        "image": "",
        "following": false
      },
      "updatedAt": 1623725531672
    },
    {
      "createdAt": 1623725531826,
      "id": "09a6c8cb-4e94-49ed-bdf2-26d39ca44646",
      "body": "test comment 620egq",
      "slug": "title-lbtdsj",
      "author": {
        "username": "commenter-p9xlj3",
        "bio": "",
        "image": "",
        "following": false
      },
      "updatedAt": 1623725531826
    },
    {
      "createdAt": 1623725531707,
      "id": "41c7214b-c28c-4782-b4e8-ac3f17973011",
      "body": "test comment gl2tf8",
      "slug": "title-lbtdsj",
      "author": {
        "username": "commenter-p9xlj3",
        "bio": "",
        "image": "",
        "following": false
      },
      "updatedAt": 1623725531707
    },
    {
      "createdAt": 1623725531770,
      "id": "73438052-8210-4904-aa08-0288108d978e",
      "body": "test comment 95o1bk",
      "slug": "title-lbtdsj",
      "author": {
        "username": "commenter-p9xlj3",
        "bio": "",
        "image": "",
        "following": false
      },
      "updatedAt": 1623725531770
    },
    {
      "createdAt": 1623725531749,
      "id": "fe5d2f10-fc3d-49ae-a398-69e3fb1856d6",
      "body": "test comment b8ugzw",
      "slug": "title-lbtdsj",
      "author": {
        "username": "commenter-p9xlj3",
        "bio": "",
        "image": "",
        "following": false
      },
      "updatedAt": 1623725531749
    },
    {
      "createdAt": 1623725531801,
      "id": "7c232494-4c08-4b3e-b32c-f38136b0a6d5",
      "body": "test comment mf0pcu",
      "slug": "title-lbtdsj",
      "author": {
        "username": "commenter-p9xlj3",
        "bio": "",
        "image": "",
        "following": false
      },
      "updatedAt": 1623725531801
    },
    {
      "createdAt": 1623725531920,
      "id": "ff177d28-7645-45d1-934c-405c0dc92483",
      "body": "test comment asu2it",
      "slug": "title-lbtdsj",
      "author": {
        "username": "commenter-p9xlj3",
        "bio": "",
        "image": "",
        "following": false
      },
      "updatedAt": 1623725531920
    },
    {
      "createdAt": 1623725531880,
      "id": "1437396b-6830-44c0-b781-5b3099f7ebba",
      "body": "test comment qwn4tl",
      "slug": "title-lbtdsj",
      "author": {
        "username": "commenter-p9xlj3",
        "bio": "",
        "image": "",
        "following": false
      },
      "updatedAt": 1623725531880
    },
    {
      "createdAt": 1623725531855,
      "id": "3aa87531-6d01-4208-ba23-9cdf88c65464",
      "body": "test comment 72n3pz",
      "slug": "title-lbtdsj",
      "author": {
        "username": "commenter-p9xlj3",
        "bio": "",
        "image": "",
        "following": false
      },
      "updatedAt": 1623725531855
    },
    {
      "createdAt": 1623725531727,
      "id": "d3b72a3d-1b28-4646-95a0-a4411e8fd8be",
      "body": "test comment 4r1mzr",
      "slug": "title-lbtdsj",
      "author": {
        "username": "commenter-p9xlj3",
        "bio": "",
        "image": "",
        "following": false
      },
      "updatedAt": 1623725531727
    }
  ]
}
```
## Delete
### should delete comment
```
DELETE /articles/title-lbtdsj/comments/d151f97e-ab5c-4617-864e-60033ea27440
```
```
200 OK

{}
```
### only comment author should be able to delete comment
```
DELETE /articles/title-lbtdsj/comments/41c7214b-c28c-4782-b4e8-ac3f17973011
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Only comment author can delete: [commenter-p9xlj3]"
    ]
  }
}
```
### should disallow unauthenticated user
```
DELETE /articles/title-lbtdsj/comments/41c7214b-c28c-4782-b4e8-ac3f17973011
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Must be logged in."
    ]
  }
}
```
### should disallow deleting unknown comment
```
DELETE /articles/title-lbtdsj/comments/foobar_id
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Comment ID not found: [foobar_id]"
    ]
  }
}
```
# User
## Create
### should create user
```
POST /users

{
  "user": {
    "email": "user1-0.xnkrk8n2y9r@email.com",
    "username": "user1-0.xnkrk8n2y9r",
    "password": "password"
  }
}
```
```
200 OK

{
  "user": {
    "email": "user1-0.xnkrk8n2y9r@email.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIxLTAueG5rcms4bjJ5OXIiLCJpYXQiOjE2MjM3MjU1MzIsImV4cCI6MTYyMzg5ODMzMn0.E1SkUOYGolFA4OPtgLXqQ4og5A7k8sVS_9UowGT4g88",
    "username": "user1-0.xnkrk8n2y9r",
    "bio": "",
    "image": ""
  }
}
```
### should disallow same username
```
POST /users

{
  "user": {
    "email": "user1-0.xnkrk8n2y9r@email.com",
    "username": "user1-0.xnkrk8n2y9r",
    "password": "password"
  }
}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Username already taken: [user1-0.xnkrk8n2y9r]"
    ]
  }
}
```
### should disallow same email
```
POST /users

{
  "user": {
    "username": "user2",
    "email": "user1-0.xnkrk8n2y9r@email.com",
    "password": "password"
  }
}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Email already taken: [user1-0.xnkrk8n2y9r@email.com]"
    ]
  }
}
```
### should enforce required fields
```
POST /users

{}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "User must be specified."
    ]
  }
}
```
```
POST /users

{
  "user": {
    "foo": 1
  }
}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Username must be specified."
    ]
  }
}
```
```
POST /users

{
  "user": {
    "username": 1
  }
}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Email must be specified."
    ]
  }
}
```
```
POST /users

{
  "user": {
    "username": 1,
    "email": 2
  }
}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Password must be specified."
    ]
  }
}
```
## Login
### should login
```
POST /users/login

{
  "user": {
    "email": "user1-0.xnkrk8n2y9r@email.com",
    "password": "password"
  }
}
```
```
200 OK

{
  "user": {
    "email": "user1-0.xnkrk8n2y9r@email.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIxLTAueG5rcms4bjJ5OXIiLCJpYXQiOjE2MjM3MjU1MzIsImV4cCI6MTYyMzg5ODMzMn0.E1SkUOYGolFA4OPtgLXqQ4og5A7k8sVS_9UowGT4g88",
    "username": "user1-0.xnkrk8n2y9r",
    "bio": "",
    "image": ""
  }
}
```
### should disallow unknown email
```
POST /users/login

{
  "user": {
    "email": "0.c2vjhhb3337",
    "password": "somepassword"
  }
}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Email not found: [0.c2vjhhb3337]"
    ]
  }
}
```
### should disallow wrong password
```
POST /users/login

{
  "user": {
    "email": "user1-0.xnkrk8n2y9r@email.com",
    "password": "0.98y1wg9aauj"
  }
}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Wrong password."
    ]
  }
}
```
### should enforce required fields
```
POST /users/login

{}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "User must be specified."
    ]
  }
}
```
```
POST /users/login

{
  "user": {}
}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Email must be specified."
    ]
  }
}
```
```
POST /users/login

{
  "user": {
    "email": "someemail"
  }
}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Password must be specified."
    ]
  }
}
```
## Get
### should get current user
```
GET /user
```
```
200 OK

{
  "user": {
    "email": "user1-0.xnkrk8n2y9r@email.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIxLTAueG5rcms4bjJ5OXIiLCJpYXQiOjE2MjM3MjU1MzIsImV4cCI6MTYyMzg5ODMzMn0.E1SkUOYGolFA4OPtgLXqQ4og5A7k8sVS_9UowGT4g88",
    "username": "user1-0.xnkrk8n2y9r",
    "bio": "",
    "image": ""
  }
}
```
### should disallow bad tokens
```
GET /user
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Token not present or invalid."
    ]
  }
}
```
```
GET /user
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Token not present or invalid."
    ]
  }
}
```
```
GET /user
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Token not present or invalid."
    ]
  }
}
```
```
GET /user
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Token not present or invalid."
    ]
  }
}
```
## Profile
### should get profile
```
GET /profiles/user1-0.xnkrk8n2y9r
```
```
200 OK

{
  "profile": {
    "username": "user1-0.xnkrk8n2y9r",
    "bio": "",
    "image": "",
    "following": false
  }
}
```
### should disallow unknown username
```
GET /profiles/foo_0.w1y1y64g5s9
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "User not found: [foo_0.w1y1y64g5s9]"
    ]
  }
}
```
### should follow/unfollow user
```
POST /users

{
  "user": {
    "username": "followed_user",
    "email": "followed_user@mail.com",
    "password": "password"
  }
}
```
```
200 OK

{
  "user": {
    "email": "followed_user@mail.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImZvbGxvd2VkX3VzZXIiLCJpYXQiOjE2MjM3MjU1MzIsImV4cCI6MTYyMzg5ODMzMn0.huaaG4ubGNcsXVykt2yK6vkWce65Sl4QauLy0Bs7X8M",
    "username": "followed_user",
    "bio": "",
    "image": ""
  }
}
```
```
POST /profiles/followed_user/follow
```
```
200 OK

{
  "profile": {
    "username": "followed_user",
    "bio": "",
    "image": "",
    "following": true
  }
}
```
```
POST /profiles/followed_user/follow
```
```
200 OK

{
  "profile": {
    "username": "followed_user",
    "bio": "",
    "image": "",
    "following": true
  }
}
```
```
GET /profiles/followed_user
```
```
200 OK

{
  "profile": {
    "username": "followed_user",
    "bio": "",
    "image": "",
    "following": true
  }
}
```
```
GET /profiles/followed_user
```
```
200 OK

{
  "profile": {
    "username": "followed_user",
    "bio": "",
    "image": "",
    "following": false
  }
}
```
```
POST /users

{
  "user": {
    "username": "user2-0.xvrwuf0n1qq",
    "email": "user2-0.xvrwuf0n1qq@mail.com",
    "password": "password"
  }
}
```
```
200 OK

{
  "user": {
    "email": "user2-0.xvrwuf0n1qq@mail.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIyLTAueHZyd3VmMG4xcXEiLCJpYXQiOjE2MjM3MjU1MzIsImV4cCI6MTYyMzg5ODMzMn0.x24yBYRz-Dj8tIWC3LCoa5XuouNVn1IOc1MZmtD_t14",
    "username": "user2-0.xvrwuf0n1qq",
    "bio": "",
    "image": ""
  }
}
```
```
POST /profiles/followed_user/follow
```
```
200 OK

{
  "profile": {
    "username": "followed_user",
    "bio": "",
    "image": "",
    "following": true
  }
}
```
```
DELETE /profiles/followed_user/follow
```
```
200 OK

{
  "profile": {
    "username": "followed_user",
    "bio": "",
    "image": "",
    "following": false
  }
}
```
```
DELETE /profiles/followed_user/follow
```
```
200 OK

{
  "profile": {
    "username": "followed_user",
    "bio": "",
    "image": "",
    "following": false
  }
}
```
```
DELETE /profiles/followed_user/follow
```
```
200 OK

{
  "profile": {
    "username": "followed_user",
    "bio": "",
    "image": "",
    "following": false
  }
}
```
### should disallow following with bad token
```
POST /profiles/followed_user/follow
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Token not present or invalid."
    ]
  }
}
```
## Update
### should update user
```
PUT /user

{
  "user": {
    "email": "updated-user1-0.xnkrk8n2y9r@email.com"
  }
}
```
```
200 OK

{
  "user": {
    "username": "user1-0.xnkrk8n2y9r",
    "email": "updated-user1-0.xnkrk8n2y9r@email.com",
    "image": "",
    "bio": "",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIxLTAueG5rcms4bjJ5OXIiLCJpYXQiOjE2MjM3MjU1MzIsImV4cCI6MTYyMzg5ODMzMn0.E1SkUOYGolFA4OPtgLXqQ4og5A7k8sVS_9UowGT4g88"
  }
}
```
```
PUT /user

{
  "user": {
    "password": "newpassword"
  }
}
```
```
200 OK

{
  "user": {
    "username": "user1-0.xnkrk8n2y9r",
    "email": "updated-user1-0.xnkrk8n2y9r@email.com",
    "image": "",
    "bio": "",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIxLTAueG5rcms4bjJ5OXIiLCJpYXQiOjE2MjM3MjU1MzIsImV4cCI6MTYyMzg5ODMzMn0.E1SkUOYGolFA4OPtgLXqQ4og5A7k8sVS_9UowGT4g88"
  }
}
```
```
PUT /user

{
  "user": {
    "bio": "newbio"
  }
}
```
```
200 OK

{
  "user": {
    "username": "user1-0.xnkrk8n2y9r",
    "bio": "newbio",
    "image": "",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIxLTAueG5rcms4bjJ5OXIiLCJpYXQiOjE2MjM3MjU1MzIsImV4cCI6MTYyMzg5ODMzMn0.E1SkUOYGolFA4OPtgLXqQ4og5A7k8sVS_9UowGT4g88"
  }
}
```
```
PUT /user

{
  "user": {
    "image": "newimage"
  }
}
```
```
200 OK

{
  "user": {
    "username": "user1-0.xnkrk8n2y9r",
    "image": "newimage",
    "bio": "newbio",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIxLTAueG5rcms4bjJ5OXIiLCJpYXQiOjE2MjM3MjU1MzIsImV4cCI6MTYyMzg5ODMzMn0.E1SkUOYGolFA4OPtgLXqQ4og5A7k8sVS_9UowGT4g88"
  }
}
```
### should disallow missing token/email in update
```
PUT /user
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Token not present or invalid."
    ]
  }
}
```
```
PUT /user

{}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "User must be specified."
    ]
  }
}
```
### should disallow reusing email
```
POST /users

{
  "user": {
    "email": "user2-0.t67vb1bjxzg@email.com",
    "username": "user2-0.t67vb1bjxzg",
    "password": "password"
  }
}
```
```
200 OK

{
  "user": {
    "email": "user2-0.t67vb1bjxzg@email.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIyLTAudDY3dmIxYmp4emciLCJpYXQiOjE2MjM3MjU1MzIsImV4cCI6MTYyMzg5ODMzMn0.lhgJX4leJ5dnMJHZNWOdpDlvQCT5IT-mfb2WvVc1dFc",
    "username": "user2-0.t67vb1bjxzg",
    "bio": "",
    "image": ""
  }
}
```
```
PUT /user

{
  "user": {
    "email": "user2-0.t67vb1bjxzg@email.com"
  }
}
```
```
422 Unprocessable Entity

{
  "errors": {
    "body": [
      "Email already taken: [user2-0.t67vb1bjxzg@email.com]"
    ]
  }
}
```
# Util
## Ping
### should ping
```
GET /ping
```
```
200 OK

{
  "pong": "2021-06-15T02:52:12.838Z",
  "AWS_REGION": "us-east-1",
  "DYNAMODB_NAMESPACE": "dev"
}
```
