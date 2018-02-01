process.env.NODE_ENV = "test";
import chai from "chai";
import chaiHTTP from "chai-http";
import chaiJsonPattern from "chai-json-pattern";

import faker from "faker";
import { generateUser } from "./api.users.test";

const app = require("../src/app");
let expect = chai.expect;
let should = chai.should();

let receivedArticle = {};
let receivedComment;
chai.use(chaiHTTP);
chai.use(chaiJsonPattern);
const generateComment = () => {
    return { comment: { body: faker.lorem.sentence() } };
};

let receivedUser = {};
describe("/api/articles/:article/comments", () => {
    before(done => {
        chai
            .request(app)
            .post("/api/users")
            .send({ user: generateUser() })
            .end((err, res) => {
                expect(err).to.be.null;
                receivedUser = res.body;
                done();
            });
    });

    describe("POST /api/articles/:article/comments", () => {
        it("should create comment", done => {
            chai
                .request(app)
                .post(`/api/articles/how-to-train-your-dragon/comments`)
                .set("Authorization", `Token ${receivedUser.user.token}`)
                .send(generateComment())
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body).to.matchPattern(comment());
                    receivedComment = res.body;
                    console.log(receivedComment);
                    done();
                });
        });
    });

    describe("GET /api/articles/:article/comments", () => {
        it("should list all comments with authorization", done => {
            chai
                .request(app)
                .get("/api/articles/how-to-train-your-dragon/comments")
                .set("Authorization", `Token ${receivedUser.user.token}`)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body).to.matchPattern(multipleComments());
                    done();
                });
        });

        it("should list all comments without authorization", done => {
            chai
                .request(app)
                .get("/api/articles/how-to-train-your-dragon/comments")
                .set("Authorization", `Token ${receivedUser.user.token}`)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body).to.matchPattern(multipleComments());
                    done();
                });
        });
    });
    describe("DELETE /api/articles/how-to-train-your-dragon/", () => {
        it("should delete comment", done => {
            chai
                .request(app)
                .delete(
                    `/api/articles/how-to-train-your-dragon/comments/${
                        receivedComment.comment.id
                    }`
                )
                .set("Authorization", `Token ${receivedUser.user.token}`)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(204);
                    done();
                });
        });
    });
});

const comment = () => {
    return `{
        "comment": {
            "id": String,
            "body": String,
            "createdAt": String,
            "updatedAt": String,
            "author": {
                "username": String,
                "bio": String,
                "image": String,
                "following": Boolean,
            }
        }
    }`;
};

const multipleComments = () => {
    return `{
        "comments": [
            {
                "id": String,
                "body": String,
                "createdAt": String,
                "updatedAt": String,
                "author": {
                    "username": String,
                    "bio": String,
                    "image": String,
                    "following": Boolean,
                },
            },
        ...],
    }`;
};
