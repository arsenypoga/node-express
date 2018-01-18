process.env.NODE_ENV = "test";
import chai from "chai";
import chaiHTTP from "chai-http";
import chaiJsonPattern from "chai-json-pattern";

import faker from "faker";

const app = require("../src/app");
const getProfile = require("./api.profiles.test").getProfile;
let expect = chai.expect;
let should = chai.should();

chai.use(chaiHTTP);
chai.use(chaiJsonPattern);

const mockArticle = () => {
    const dataGenerated = {
        article: {
            title: faker.lorem.words(),
            description: faker.lorem.sentence(),
            body: faker.lorem.paragraphs(),
            tagList: [],
        },
        payload: { id: "5a56a1127eeabb475c769313" },
    };

    for (let i = 0; i <= Math.round(Math.random() * 20); i++) {
        dataGenerated.article.tagList.push(faker.lorem.word());
    }

    return dataGenerated;
};

const generatedArticle = mockArticle();

let receivedArticle;

describe("/api/articles", () => {
    describe("POST /api/articles", () => {
        it("should return posted article", done => {
            chai
                .request(app)
                .post("/api/articles")
                .send(generatedArticle)
                .end((err, res) => {
                    receivedArticle = res.body;
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body).to.matchPattern(responseArticle());
                    done();
                });
        });
    });

    describe("GET /api/articles", () => {
        it("should return list of default articles", done => {
            chai
                .request(app)
                .get("/api/articles")
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body).to.matchPattern(
                        multipleResponseArticles()
                    );
                    done();
                });
        });
    });
    describe("GET api/:article", () => {
        it("should return article", done => {
            chai
                .request(app)
                .get(`/api/articles/${receivedArticle.article.slug}`)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body).to.matchPattern(responseArticle());
                    expect(res.body.article.slug).to.be.equal(
                        receivedArticle.article.slug
                    );

                    done();
                });
        });
    });

    describe("PUT /api/:article", () => {
        let updateArticle = mockArticle();
        it("should update an article", done => {
            chai
                .request(app)
                .put(`/api/articles/${receivedArticle.article.slug}`)
                .send(updateArticle)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body).to.matchPattern(responseArticle());
                    expect(res.body).not.to.be.equal(generatedArticle);
                    done();
                });
        });
    });

    describe("DELETE /api/:article", () => {
        it("should delete article", done => {
            chai
                .request(app)
                .delete(`/api/articles/${receivedArticle.article.slug}`)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(204);

                    done();
                });
        });
    });
});

const multipleResponseArticles = () => {
    return `{
        "articles": [
            {
                "slug": String,
                "title": String,
                "description": String,
                "body": String,
                "tagList": [String, ...],
                "createdAt": String,
                "updatedAt": String,
                "favorited": Boolean,
                "favoritesCount": Number,
                "author": {
                    "username": String,
                    "bio": String,
                    "image": String,
                    "following": Boolean
                }
            },
            ...
        ],
        "articlesCount": Number,
    }`;
};

const responseArticle = () => {
    return `{
        "article": {
            "slug": String,
            "title": String,
            "description": String,
            "body": String,
            "tagList": [String, ... ],
            "createdAt": String, 
            "updatedAt": String,
            "favorited": Boolean,
            "favoritesCount": Number,
            "author": {
                "username": String,
                "bio": String,
                "image": String,
                "following": Boolean
            }
        }
    }`;
};
