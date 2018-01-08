//
// ──────────────────────────────────────────────────────────────── I ──────────
//   :::::: U S E R S   R O U T E S : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────
//
const Chance = require("chance");
const chance = Chance();
const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = (express, logger) => {
    const router = express.Router();

    //
    // ─── GET USER ───────────────────────────────────────────────────────────────────
    //

    router.get("/user", (req, res, next) => {
        User.findOne({ email: req.body.user.email })
            .then(user => {
                if (!user) return res.sendStatus(401);
                return res.json({ user: user.getUser() });
            })
            .catch(next);
    });

    //
    // ─── UPDATE USER ────────────────────────────────────────────────────────────────
    //

    router.put("/user", (req, res, next) => {
        logger.debug(res.payload);
        User.findOne({ email: req.body.user.email })
            .then((err, user) => {
                if (err) logger.error(err);
                logger.debug(user);
                if (!user) return res.sendStatus(401);

                //Push each update individually
                if (typeof req.payload.password !== "undefined") {
                    user.setPassword(res.payload.password);
                }

                if (typeof req.payload.email !== "undefined") {
                    user.email = res.payload.email;
                }

                if (typeof req.payload.username !== "undefined") {
                    user.username = res.payload.username;
                }

                if (typeof req.payload.bio !== "undefined") {
                    user.bio = res.payload.bio;
                }
                if (typeof req.payload.image !== "undefined") {
                    user.image = res.payload.image;
                }

                return user
                    .save()
                    .then(() => {
                        return res.send({ user: user.getUser() });
                    })
                    .catch(next);
            })
            .catch(next);
    });

    //
    // ─── AUTHENTIFICATION ───────────────────────────────────────────────────────────
    //
    router.post("/users/login", (req, res) => {
        if (!req.body.user.email) {
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
        User.findOne({ email: req.body.user.email }, (err, user) => {
            if (err) logger.error(err);
            if (user)
                logger.debug(
                    `User ${user.username} has hash ${user.hash}, has salt ${
                        user.salt
                    }`
                );
            if (!user) {
                return res.json({
                    error: { email: `Email ${req.body.user.email} is invalid` },
                });
            } else if (!user.verifyPassword(req.body.user.password)) {
                return res.json({
                    error: { password: "Password is incorrect" },
                });
            }
            return res.json({ user: user.getUser() });
        });
    });

    //
    // ─── REGISTRATION ───────────────────────────────────────────────────────────────
    //
    router.post("/users", (req, res, next) => {
        logger.debug("Request body: " + req.payload);

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
        user.hash = "sss";
        logger.debug("Sent password is: " + req.body.user.password);
        user.setPassword(req.body.user.password);

        logger.debug("Set password successfully");

        user.save((err, user) => {
            if (err) logger.error(err);
            if (!err)
                logger.debug(
                    `User ${user.username} has hash ${user.hash}, has salt ${
                        user.salt
                    }`
                );
            return res.json({ user: user.getUser() });
        });
    });

    return router;
};
