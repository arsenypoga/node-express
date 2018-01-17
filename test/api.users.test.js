//
// ────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: A P I   U S E R   R O U T E   T E S T S : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────
//

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

const generateUser = () => ({
    email: faker.internet.email(),
    password: faker.internet.password(),
    username: faker.internet.userName(),
});
let responseUser = {};
const newUser = generateUser();

describe("/api/user", () => {
    //

    // ─── REGISTRATION ───────────────────────────────────────────────────────────────
    //

    describe("POST /api/users", () => {
        it("should successfully create a user", done => {
            chai
                .request(app)
                .post("/api/users")
                .send({
                    user: newUser,
                })
                .end((err, res) => {
                    getUser(res);

                    responseUser = res.body;
                    done();
                });
        });

        it("should return an error if email is blank", done => {
            chai
                .request(app)
                .post("/api/users")
                .send({
                    user: {
                        password: faker.internet.password(),
                        username: faker.internet.userName(),
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
                        email: faker.internet.email(),
                        username: faker.internet.userName(),
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
                        email: faker.internet.email(),
                        password: faker.internet.password(),
                    },
                })
                .end((err, res) => {
                    unprocessableEntity(res, "username");
                    done();
                });
        });
    });
    //
    // ─── AUTHENTIFICATION  ───────────────────────────────────────────────────────────
    //

    describe("GET /api/user", () => {
        //TODO: add auth to the put /api/user, put get /api/user
        it("should return user if authentificated", done => {
            chai
                .request(app)
                .get("/api/user")
                .send(responseUser)
                .end((err, res) => {
                    getUser(res);
                    done();
                });
        });
        it("should fail if not authentificated", done => {
            chai
                .request(app)
                .get("/api/user")
                .send({ user: generateUser })
                .end((err, res) => {
                    res.should.not.have.status(200);
                    res.body.should.be.a("object");
                    done();
                });
        });
    });

    describe("POST /api/users/login", () => {
        it("should Successfully authentificates", done => {
            let sentUser = {
                email: newUser.email,
                password: newUser.password,
            };
            chai
                .request(app)
                .post("/api/users/login")
                .send({
                    user: sentUser,
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
                        password: newUser.password,
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
                        email: newUser.email,
                    },
                })
                .end((err, res) => {
                    unprocessableEntity(res, "password");
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
                    email: faker.internet.email(),
                    password: faker.internet.password(),
                    username: faker.internet.userName(),
                    id: responseUser.user.id,
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
    res.body.user.should.have.property("id");
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
