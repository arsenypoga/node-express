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

chai.use(chaiHTTP);

const generateUser = () => ({
    email: faker.internet.email(),
    password: faker.internet.password(),
    username: faker.internet.userName(),
});

let responseUser = {};
const newUser = generateUser();

describe("/api/users", () => {
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
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body).to.matchPattern(getUser());

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
                    expect(err).to.exist;
                    expect(res).a.have.status(422);
                    expect(res.body).to.matchPattern(
                        unprocessableEntry("email")
                    );
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
                    expect(err).to.exist;
                    expect(res).a.have.status(422);
                    expect(res.body).to.matchPattern(
                        unprocessableEntry("password")
                    );
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
                    expect(err).to.exist;
                    expect(res).a.have.status(422);
                    expect(res.body).to.matchPattern(
                        unprocessableEntry("username")
                    );
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
                .set("Authorization", `Token ${responseUser.user.token}`)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).a.have.status(200);
                    expect(res.body).to.matchPattern(getUser());
                    done();
                });
        });
        it("should fail if not authentificated", done => {
            chai
                .request(app)
                .get("/api/user")
                .send({ user: generateUser })
                .end((err, res) => {
                    expect(err).to.exist;
                    expect(res).a.have.status(401);
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
                    expect(err).to.be.null;
                    expect(res).a.have.status(200);
                    expect(res.body).to.matchPattern(getUser());
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
                    expect(err).to.exist;
                    expect(res).a.have.status(422);
                    expect(res.body).to.matchPattern(
                        unprocessableEntry("email")
                    );
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
                    expect(err).to.exist;
                    expect(res).a.have.status(422);
                    expect(res.body).to.matchPattern(
                        unprocessableEntry("password")
                    );
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
                .set("Authorization", `Token ${responseUser.user.token}`)
                .send(appliedUser)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).a.have.status(200);
                    expect(res.body).to.matchPattern(getUser());

                    done();
                });
        });
    });
});

const getProfile = () => `{
        "profile": {
            "username": String,
            "bio": String,
            "image": String,
            "following": Boolean,
        }
    }`;

const getUser = () => `{
    "user": {
        "username": String,
        "email": String,
        "bio": String,
        "image": String,
        "token": String,
        "id": String 
    }
}`;

const unprocessableEntry = property => `{
    "errors": {
        "${property}": String
    }
}`;

export { generateUser, getUser, getProfile };
