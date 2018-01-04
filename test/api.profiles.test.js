//
// ────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: A P I   P R O F I L E   T E S T S : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────
//
process.env.NODE_ENV = "test";
const chai = require("chai");
const chaiHTTP = require("chai-http");
const assert = require("assert");
const Chance = require("chance");

const chance = new Chance();
const app = require("../app.js");
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
                .get("/api/profiles/" + chance.email().split("@", 1))
                .end((err, res) => {
                    getProfile(res);
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
                .post(
                    "/api/profiles/" + chance.email().split("@", 1) + "/follow"
                )
                .end((req, res) => {
                    getProfile(res);
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
                    "/api/profiles/" + chance.email().split("@", 1) + "/follow"
                )
                .end((req, res) => {
                    getProfile(res);
                    done();
                });
        });
    });
});
const profilePropertyPair = (res, name, type) => {
    res.body.profile.should.have.property(name);
    res.body.profile[name].should.be.a(type);
};

const getProfile = res => {
    res.body.should.be.a("object");
    res.body.should.have.property("profile");
    profilePropertyPair(res, "username", "string");
    profilePropertyPair(res, "bio", "string");
    profilePropertyPair(res, "image", "string");
    profilePropertyPair(res, "following", "boolean");
};
