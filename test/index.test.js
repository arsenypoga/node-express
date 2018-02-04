// Force env to be test as fast as possible
process.env.NODE_ENV = "test";
import chai from "chai";
import chaiHTTP from "chai-http";
import chaiJsonPattern from "chai-json-pattern";

import faker from "faker";

const app = require("../src/app");
let expect = chai.expect;
let should = chai.should();

chai.use(chaiHTTP);

describe("GET /statistics", () => {
    it("should get index http", done => {
        chai
            .request(app)
            .get("/statistics")
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
});
