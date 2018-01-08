const mongoose = require("mongoose");
//const uniqueValidator = require("mongoose-unique-validator");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const logger = require("../logger.js");

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            lowercase: true,
            unique: false,
            required: [true, "can't be blank"],
        },
        username: {
            type: String,
            lowercase: true,
            unique: false,
            required: [true, "can't be blank"],
        },
        bio: String,
        image: String,
        salt: { type: String, required: [true, "can't be blank"] },
        hash: { type: String, required: [true, "can't be blank"] },
    },
    { timestamps: true }
);

// Add plugin for the
//UserSchema.plugin(uniqueValidator, { message: "is already taken" });

UserSchema.methods.verifyPassword = function(password) {
    logger.debug("Verifying Password...");
    logger.debug(this.hash);
    logger.debug(password);

    bcrypt.compare(password, this.hash, (err, res) => {
        logger.debug(
            res ? "Password matches hash" : "Password doesn't match hash"
        );
        if (err) logger.error(err);
        return !err ? res : err;
    });
};

UserSchema.methods.setPassword = function(password) {
    logger.debug("Setting passoword for new user");
    /* bcrypt.genSalt(10, (err, salt) => {
        if (err) logger.log(err);
        bcrypt.hash(password, salt, (err, hash) => {
            if (err) logger.log(err);

            user.salt = salt.toString("hex");
            logger.debug(this.salt + " " + typeof this.salt);
            user.hash = hash.toString("hex");
            logger.debug(this.hash);
        });
    }); */
    this.salt = bcrypt.genSaltSync(256);
    this.hash = bcrypt.hashSync(password, this.salt);

    //this.salt = crypto.randomBytes(16).toString("hex");
    /*this.hash = crypto
        .pbkdf2Sync(password, this.salt, 256, 512, "sha512")
        .toString();
*/
    logger.debug("Successfully created new user");
};

UserSchema.methods.generateJWT = function() {
    logger.debug("Started JWT Generation");
    let now = new Date();
    let exp = new Date(now);
    exp.setDate(now.getDate() + 60);

    return jwt.sign(
        {
            id: this._id,
            username: this.username,
            exp: parseInt(exp.getTime() / 1000),
        },
        this.salt
    );
};

UserSchema.methods.getUser = function() {
    logger.debug("Getting User object!");
    return {
        username: this.username,
        email: this.email,
        bio: this.bio,
        image: this.image,
        token: this.generateJWT(),
    };
};

module.exports = mongoose.model("User", UserSchema);
