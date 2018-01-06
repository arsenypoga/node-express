const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            lowercase: true,
            unique: true,
            required: [true, "can't be blank"],
        },
        username: {
            type: String,
            lowercase: true,
            unique: true,
            required: [true, "can't be blank"],
        },
        bio: String,
        image: String,
        salt: String,
        hash: String,
    },
    { timestamps: true }
);
// Add plugin for the
// UserSchema.plugin(uniqueValidator, { message: "is already taken" });

/* UserSchema.methods.validPassword = function(password) {
    let hash = crypto
        .pbkdf2(password, this.salt, 10000, 512, "sha512")
        .toString("hex");
    return this.hash === hash;
}; */

/* UserSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString("hex");
    this.hash = crypto
        .pbkdf2(password, this.salt, 10000, 512, "sha512")
        .toString("hex");
}; */

/* UserSchema.methods.generateJWT = function() {
    let now = new Date();
    let exp = new Date(now);
    exp.setDate(now.getDate() + 60);

    return jwt.sign(
        {
            id: this._id,
            username: this.username,
            exp: parseInt(exp.getTime() / 1000),
        },
        "kappa123"
    );
}; */

module.exports = mongoose.model("User", UserSchema);
