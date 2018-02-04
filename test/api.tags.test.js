process.env.NODE_ENV = "test";
import chai from "chai";
import chaiHTTP from "chai-http";
import chaiJsonPattern from "chai-json-pattern";
const app = require("../src/app");

import faker from "faker";

let expect = chai.expect;

chai.use(chaiHTTP);
chai.use(chaiJsonPattern);

describe("/api/tags", () => {
    describe("GET /api/tags", () => {
        it("should return all tags", done => {
            chai
                .request(app)
                .get("/api/tags")
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body).to.matchPattern(`{"tags": [String, ...]}`);

                    done();
                });
        });
    });
});
