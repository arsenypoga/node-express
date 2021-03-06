//
// ──────────────────────────────────────────────────────────────── I ──────────
//   :::::: U S E R S   R O U T E S : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────
//
import mongoose from "mongoose";
import { auth } from "./../auth";
const User = mongoose.model("User");
import passport from "passport";
module.exports = (express, logger) => {
    const router = express.Router();

    //
    // ─── GET USER ───────────────────────────────────────────────────────────────────
    //

    router.get("/user", auth.required, (req, res, next) => {
        logger.debug(req.payload);
        User.findById(req.payload.id)
            .then(user => {
                if (!user) return res.sendStatus(401);
                return res.json({ user: user.getUser() });
            })
            .catch(next);
    });

    //
    // ─── UPDATE USER ────────────────────────────────────────────────────────────────
    //

    router.put("/user", auth.required, (req, res, next) => {
        User.findById(req.body.user.id, (err, user) => {
            if (err) logger.error(err);
            if (!user) return res.sendStatus(401);

            //Push each update individually
            if (typeof req.body.password !== "undefined") {
                user.setPassword(res.body.password);
            }

            if (typeof req.body.email !== "undefined") {
                user.email = res.body.email;
            }

            if (typeof req.body.username !== "undefined") {
                user.username = res.body.username;
            }

            if (typeof req.body.bio !== "undefined") {
                user.bio = res.body.bio;
            }
            if (typeof req.body.image !== "undefined") {
                user.image = res.body.image;
            }

            return user
                .save()
                .then(() => {
                    return res.send({ user: user.getUser() });
                })
                .catch(next);
        });
    });

    //
    // ─── AUTHENTIFICATION ───────────────────────────────────────────────────────────
    //
    router.post("/users/login", (req, res, next) => {
        logger.debug(req.body);
        if (!req.body.user.email) {
            logger.error("No email : " + req.body.user);
            return res.status(422).json({
                errors: {
                    email: "can't be blank",
                },
            });
        }

        if (!req.body.user.password) {
            return res.status(422).json({
                errors: {
                    password: "can't be blank",
                },
            });
        }
        passport.authenticate(
            "local",
            { session: false },
            (err, user, info) => {
                if (err) return next(err);

                if (user) {
                    user.token = user.generateJWT();
                    return res.json({ user: user.getUser() });
                } else {
                    return res
                        .status(422)
                        .json(info)
                        .end();
                }
            }
        )(req, res, next);
    });

    //
    // ─── REGISTRATION ───────────────────────────────────────────────────────────────
    //
    router.post("/users", (req, res, next) => {
        if (!req.body.user.password) {
            return res.status(422).json({
                errors: {
                    password: "can't be blank",
                },
            });
        }
        if (!req.body.user.username) {
            return res.status(422).json({
                errors: {
                    username: "can't be blank",
                },
            });
        }
        if (!req.body.user.email) {
            return res.status(422).json({
                errors: {
                    email: "can't be blank",
                },
            });
        }

        const user = new User();
        user.email = req.body.user.email;
        user.username = req.body.user.username;
        user.bio = req.body.user.bio || "Your bio here";
        user.image = req.body.user.image || "null";
        logger.debug("Sent password is: " + req.body.user.password);
        user.setPassword(req.body.user.password);

        logger.debug("Set password successfully");

        user
            .save()
            .then(() => {
                // if (err) return next(err);
                //logger.debug(
                //    `User ${user.username} has hash ${user.hash}, has salt ${
                //        user.salt
                //    }`
                //);
                return res.json({ user: user.getUser() });
            })
            .catch(next);
    });

    return router;
};
