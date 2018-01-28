import mongoose from "mongoose";
import { sign } from "jsonwebtoken";
//const uniqueValidator = require("mongoose-unique-validator");
import { genSaltSync, hashSync, compare, compareSync } from "bcrypt";
import logger from "./../logger";
import { secret } from "./../routes/auth";

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
        following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }],
    },
    { timestamps: true }
);

// Add plugin for the
//UserSchema.plugin(uniqueValidator, { message: "is already taken" });

UserSchema.methods.verifyPassword = function(password) {
    logger.debug("Verifying Password...");
    logger.debug(this.hash);
    logger.debug(password);

    return compareSync(password, this.hash);
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
    this.salt = genSaltSync(256);
    this.hash = hashSync(password, this.salt);

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

    return sign(
        {
            id: this._id,
            username: this.username,
            exp: parseInt(exp.getTime() / 1000),
        },
        secret
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
        id: this._id,
    };
};
UserSchema.methods.getProfile = function(user) {
    return {
        username: this.username,
        bio: this.bio,
        image: this.image,
        following: user ? user.isFollowing(this._id) : false,
    };
};
//user ? user.isFollowing(user._id) :
UserSchema.methods.follow = function(id) {
    if (this.following.indexOf(id) === -1) {
        this.following.push(id);
    }
    return this.save();
};

UserSchema.methods.unfollow = function(id) {
    this.following.remove(id);
    return this.save();
};

UserSchema.methods.isFollowing = function(id) {
    return this.following.some(userid => {
        return userid.toString() === id.toString();
    });
};

UserSchema.methods.favorite = function(id) {
    if (this.favorites.indexOf(id) === -1) {
        this.favorites.push(id);
    }

    return this.save();
};

UserSchema.methods.unfavorite = function(id) {
    this.favorites.remove(id);
    return this.save();
};

UserSchema.methods.isFavorite = function(id) {
    return this.favorites.some(function(favoriteId) {
        return favoriteId.toString() === id.toString();
    });
};

module.exports = mongoose.model("User", UserSchema);
