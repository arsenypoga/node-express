process.env.NODE_ENV = "test";
const chai = require("chai");
const chaiHTTP = require("chai-http");
const assert = require("assert");

const faker = require("faker");

const app = require("../app.js");
let should = chai.should();
chai.use(chaiHTTP);

const mockArticle = () => {
    article = {
        article: {
            title: faker.lorem.words(),
            description: faker.lorem.sentence(),
            body: faker.lorem.paragraphs(),
            tagList: [
                faker.lorem.string(),
                faker.lorem.string(),
                faker.lorem.string(),
                faker.lorem.string(),
            ],
        },
        payload: { id: "5a56a1127eeabb475c769313" },
    };
    return article;
};

describe("/api/articles", () => {
    describe("POST /api/articles", () => {
        it("should return article", done => {
            chai
                .request(app)
                .post("/api/articles")
                .send({
                    article: {
                        title: faker.lorem.words(),
                        description: faker.lorem.sentence(),
                        body: faker.lorem.paragraphs(),
                        tagList: [
                            faker.lorem.word(),
                            faker.lorem.word(),
                            faker.lorem.word(),
                            faker.lorem.word(),
                        ],
                    },
                    payload: { id: "5a56a1127eeabb475c769313" },
                })
                .end((err, res) => {
                    console.log(res);
                    if (err) console.log(err);
                    done();
                });
        });
    });
});

const responseArticle = res => {
    res.should.have.status(200);
    res.should.be.a("object");
    res.should.have.property("article");
    articlePropertyPair(res, "slug", "string");
    articlePropertyPair(res, "title", "string");
    articlePropertyPair(res, "description", "string");
    articlePropertyPair(res, "body", "string");
    articlePropertyPair(res, "tagList", "array");
    res.body.article.tagList.contains.all("string");
    articlePropertyPair(res, "createdAt", "string");
    articlePropertyPair(res, "updatedAt", "string");
    articlePropertyPair(res, "favored", "boolean");
    articlePropertyPair(res, "favoritesCount", "number");
    articlePropertyPair(res, "author", "object");
    res.body.article.author.should.have.property("username");
    res.body.article.author.username.should.be.a("string");
    res.body.article.author.should.have.property("bio");
    res.body.article.author.username.should.be.a("string");
    res.body.article.author.should.have.property("image");
    res.body.article.author.username.should.be.a("string");
    res.body.article.author.should.have.property("following");
    res.body.article.author.username.should.be.a("boolean");
};

const articlePropertyPair = (res, name, type) => {
    res.body.article.should.have.property(name);
    res.body.article[name].should.be.a(type);
};
