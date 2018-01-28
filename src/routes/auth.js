import jwt from "express-jwt";
import Strategy from "passport-local";
import passport from "passport";
import { v4 } from "uuid";

const User = require("./../models/User");
const generateTokenFromHeader = req => {
    if (
        (req.headers.authorization &&
            req.headers.authorization.split(" ")[0] === "Token") ||
        (req.headers.authorization &&
            req.headers.authorization.split(" ")[0] === "Bearer")
    ) {
        return req.headers.authorization.split(" ")[1];
    }
};
const secret = v4();
const localStrategy = () => {
    passport.use(
        new Strategy(
            {
                usernameField: "user[email]",
                passwordField: "user[password]",
            },
            (email, password, done) => {
                User.findOne({ email: email })
                    .then(user => {
                        if (!user) {
                            return done(null, false, {
                                errors: { email: "is invalid" },
                            });
                        }
                        if (!user.verifyPassword(password)) {
                            return done(null, false, {
                                errors: { password: "is invalid" },
                            });
                        }
                        return done(null, user);
                    })
                    .catch(done);
            }
        )
    );
};

const auth = {
    required: jwt({
        secret: secret,
        userProperty: "payload",
        getToken: generateTokenFromHeader,
    }),
    optional: jwt({
        secret: secret,
        userProperty: "payload",
        getToken: generateTokenFromHeader,
        credentialsRequired: false,
    }),
};

export { localStrategy, secret, auth };
