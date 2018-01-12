//
// ────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: P R O F I L E S   R O U T E S : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────
//

const User = require("../../models/User");

const chance = require("chance")();
module.exports = (express, logger) => {
    const profile = () => {
        logger.info("Creating profile!");
        return {
            profile: {
                username: chance
                    .email()
                    .split("@", 1)
                    .join(""),
                bio: chance.string(),
                image: chance.string(),
                following: chance.bool(),
            },
        };
    };

    const router = express.Router();

    router.param("username", (req, res, next) => {
        if (req.body) {
            User.findById(req.body.user.id, (err, user) => {
                if (!user) return res.sendStatus(404);
                req.profile = user;
                return next();
            }).catch(next);
        }
    });

    router.get("/:username", (req, res) => {
        logger.debug(req.params);
        res.status(200).json(profile());
    });
    router.post("/:username/follow", (req, res) => {
        logger.debug(req.params);
        res.status(200).json(profile());
    });

    router.delete("/:username/follow", (req, res) => {
        logger.debug(req.params);
        res.status(200).json(profile());
    });

    return router;
};
