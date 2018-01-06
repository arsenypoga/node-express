// Force env to be test as fast as possible
process.env.NODE_ENV = "test";
const chai = require("chai");
const chaiHTTP = require("chai-http");
const assert = require("assert");

const app = require("../app.js");
let should = chai.should();
chai.use(chaiHTTP);

const Mockgoose = require("mockgoose-fix").Mockgoose;
const Mongoose = require("mongoose").Mongoose;
const mongoose = new Mongoose();
const mockgoose = new Mockgoose(mongoose);
const pckg = require("../package.json");

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

module.exports.setMongoose = done => {
    mockgoose.prepareStorage().then(function() {
        mongoose.connect(pckg.urls.mongodb_test_url, err => done(err));
        mongoose.connection.on("connected", () =>
            console.log("Connection to test Database succcessful")
        );
        done();
    });
};
