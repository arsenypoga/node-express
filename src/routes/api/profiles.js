//
// ────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: P R O F I L E S   R O U T E S : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────
//

import mongoose from "mongoose";
const User = mongoose.model("User");
import { auth } from "./../auth";

module.exports = (express, logger) => {
    const router = express.Router();

    router.param("username", (req, res, next, username) => {
        if (req.body) {
            User.findOne({ username: username }, (err, user) => {
                if (!user) return res.sendStatus(404);

                req.profile = user;

                return next();
            }).catch(next);
        }
    });

    router.get("/:username", auth.optional, (req, res, next) => {
        if (req.payload) {
            User.findById(req.profile._id).then(user => {
                if (!user)
                    return res.json({ profile: req.profile.getProfile(false) });
                return res.json({ profile: req.profile.getProfile(user) });
            });
        } else {
            return res.json({ profile: req.profile.getProfile(false) });
        }
    });

    router.post("/:username/follow", auth.required, (req, res, next) => {
        let profileId = req.profile._id;

        User.findById(req.payload.id).then(user => {
            if (!user) return res.sendStatus(401);
            user
                .follow(profileId)
                .then(() => {
                    return res.json({ profile: req.profile.getProfile(user) });
                })
                .catch(next);
        });
    });

    router.delete("/:username/follow", auth.required, (req, res, next) => {
        let profileId = req.profile._id;

        User.findById(req.payload.id)
            .then(user => {
                if (!user) return res.sendStatus(401);
                return user
                    .unfollow(profileId)
                    .then(() => {
                        return res.json({
                            profile: req.profile.getProfile(user),
                        });
                    })
                    .catch(next);
            })
            .catch(next);
    });
    return router;
};
