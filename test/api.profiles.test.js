process.env.NODE_ENV = "test";
import chai from "chai";
import chaiHTTP from "chai-http";
import chaiJsonPattern from "chai-json-pattern";

import faker from "faker";
import { generateUser, getUser, getProfile } from "./api.users.test";

const app = require("../src/app");

let expect = chai.expect;

chai.use(chaiHTTP);
chai.use(chaiJsonPattern);
let receivedUser;
describe("/api/profiles/", () => {
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

    describe("GET /api/profiles/:username", () => {
        it("should return profile", done => {
            chai
                .request(app)
                .get("/api/profiles/kamren_hintz83")
                .set("Authorization", `Token ${receivedUser.user.token}`)
                .end((err, res) => {
                    expect(err, JSON.stringify(err)).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body).to.matchPattern(getProfile());
                    done();
                });
        });
    });

    describe("POST /api/profiles/:user/follow", () => {
        it("should return profile", done => {
            chai
                .request(app)
                .post("/api/profiles/kamren_hintz83/follow")
                .set("Authorization", `Token ${receivedUser.user.token}`)
                .end((err, res) => {
                    expect(err, JSON.stringify(err)).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body).to.matchPattern(getProfile());
                    done();
                });
        });
    });
    describe("DELETE /api/profiles/:user/follow", () => {
        it("should return profile", done => {
            chai
                .request(app)
                .post("/api/profiles/kamren_hintz83/follow")
                .set("Authorization", `Token ${receivedUser.user.token}`)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body).to.matchPattern(getProfile());
                    done();
                });
        });
    });
});
