// Force env to be test as fast as possible
process.env.NODE_ENV = "test";
const chai = require("chai");
const chaiHTTP = require("chai-http");
const assert = require("assert");

const app = require("../app.js");
let should = chai.should();
chai.use(chaiHTTP);

describe("GET /", () => {
    it("should get index http", done => {
        chai
            .request(app)
            .get("/")
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
});
