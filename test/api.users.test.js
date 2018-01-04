//
// ────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: A P I   U S E R   R O U T E   T E S T S : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────
//

// Force env to be test as fast as possible
process.env.NODE_ENV = "test";
const chai = require("chai");
const chaiHTTP = require("chai-http");
const assert = require("assert");
const Chance = require("chance");

const chance = new Chance();
const app = require("../app.js");
let should = chai.should();
chai.use(chaiHTTP);

describe("/api/user", () => {
    //
    // ─── AUTHENTIFICATION  ───────────────────────────────────────────────────────────
    //

    describe("GET /api/user", () => {
        //TODO: add auth to the put /api/user, put get /api/user
        it("should return user if authentificated", done => {
            chai
                .request(app)
                .get("/api/user")
                .end((err, res) => {
                    getUser(res);
                    done();
                });
        });
        it.skip("should fail if not authentificated", done => {
            chai.request(app);
        });
    });

    describe("POST /api/users/login", () => {
        it("should Successfully authentificates", done => {
            chai
                .request(app)
                .post("/api/users/login")
                .send({
                    user: {
                        email: chance.email(),
                        password: chance.guid(),
                    },
                })
                .end((err, res) => {
                    getUser(res);
                    done();
                });
        });
        it("should return error if email is blank", done => {
            chai
                .request(app)
                .post("/api/users/login")
                .send({
                    user: {
                        password: "kappa",
                    },
                })
                .end((err, res) => {
                    unprocessableEntity(res, "email");
                    done();
                });
        });
        it("should return error if password is blank", done => {
            chai
                .request(app)
                .post("/api/users/login")
                .send({
                    user: {
                        email: chance.email(),
                    },
                })
                .end((err, res) => {
                    unprocessableEntity(res, "password");
                    done();
                });
        });
    });

    //
    // ─── REGISTRATION ───────────────────────────────────────────────────────────────
    //
    describe("POST /api/users", () => {
        it("should successfully create a user", done => {
            chai
                .request(app)
                .post("/api/users")
                .send({
                    user: {
                        email: chance.email(),
                        password: chance.guid(),
                        username: chance.email().split("@", 1),
                    },
                })
                .end((err, res) => {
                    getUser(res);
                    done();
                });
        });

        it("should return an error if email is blank", done => {
            chai
                .request(app)
                .post("/api/users")
                .send({
                    user: {
                        password: chance.guid(),
                        username: chance.email().split("@", 1),
                    },
                })
                .end((err, res) => {
                    unprocessableEntity(res, "email");
                    done();
                });
        });
        it("should return an error is password is blank", done => {
            chai
                .request(app)
                .post("/api/users")
                .send({
                    user: {
                        email: chance.email(),
                        username: chance.email().split("@", 1),
                    },
                })
                .end((err, res) => {
                    unprocessableEntity(res, "password");
                    done();
                });
        });

        it("should return an error if username is blank", done => {
            chai
                .request(app)
                .post("/api/users")
                .send({
                    user: {
                        email: chance.email(),
                        password: chance.guid(),
                    },
                })
                .end((err, res) => {
                    unprocessableEntity(res, "username");
                    done();
                });
        });
    });

    //
    // ─── UPDATE ─────────────────────────────────────────────────────────────────────
    //

    describe("PUT /api/user", () => {
        it("should successfully update user if authentificated", done => {
            let appliedUser = {
                user: {
                    username: chance
                        .email()
                        .split("@", 1)
                        .join(""),
                    password: chance.guid(),
                    bio: chance.string(),
                    email: chance.email(),
                    token: chance.guid(),
                    image: "ks",
                },
            };

            chai
                .request(app)
                .put("/api/user")
                .send(appliedUser)
                .end((err, res) => {
                    getUser(res);
                    //res.body.should.be.equal(appliedUser);

                    done();
                });
        });
    });
});

const getUser = res => {
    res.should.have.status(200);
    res.body.should.be.a("object");
    res.body.should.have.property("user");
    res.body.user.should.have.property("email");
    res.body.user.should.have.property("token");
    res.body.user.should.have.property("username");
    res.body.user.should.have.property("bio");
    res.body.user.should.have.property("image");
};

const unprocessableEntity = (res, property) => {
    res.should.have.status(422);
    res.body.should.be.a("object");
    res.body.should.have.property("errors");
    res.body.errors.should.have.property(property);
    res.body.errors[property].length.should.be.gt(0);
};
