//
// ────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: A P I   P R O F I L E   T E S T S : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────
//
process.env.NODE_ENV = "test";
import chai from "chai";
import chaiHTTP from "chai-http";
import chaiJsonPattern from "chai-json-pattern";

import faker from "faker";

const app = require("../src/app");
let expect = chai.expect;
let should = chai.should();

chai.use(chaiHTTP);

describe("/api/profiles", () => {
    //
    // ─── GET PROFILE ────────────────────────────────────────────────────────────────
    //
    describe("GET /api/profiles/:username", () => {
        it("should return profile", done => {
            chai
                .request(app)
                .get("/api/profiles/" + faker.internet.userName())
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    //expect(res.body).to.matchPattern(getProfile());

                    done();
                });
        });
    });

    //
    // ─── POST PROFILE ───────────────────────────────────────────────────────────────
    //

    describe("POST /api/profiles/:username/follow", () => {
        it("should return profile", done => {
            chai
                .request(app)
                .post("/api/profiles/" + faker.internet.userName() + "/follow")
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    //expect(res.body).to.matchPattern(getProfile());

                    //expect(res.body).to.matchPattern(getProfile());
                    done();
                });
        });
    });
    //
    // ─── DELETE PROFILE ─────────────────────────────────────────────────────────────
    //
    describe("DELETE /api/profiles/:username", () => {
        it("should return profile", done => {
            chai
                .request(app)
                .delete(
                    "/api/profiles/" + faker.internet.userName() + "/follow"
                )
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    //expect(res.body).to.matchPattern(getProfile());

                    //expect(res.body).to.matchPattern(getProfile());

                    done();
                });
        });
    });
});

const getProfile = () => {
    return `{
        "profile": {
            "username": String,
            "bio": String,
            "image": String,
            "following": String
        }
    }`;
};
module.exports.getProfile = getProfile;
