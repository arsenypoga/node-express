//
// ────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: P R O F I L E S   R O U T E S : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────
//

const User = require("../../models/User");

module.exports = (express, logger) => {
    const router = express.Router();

    /*router.param("username", (req, res, next) => {
        if (req.body) {
            User.findById(req.body.user.id, (err, user) => {
                if (!user) return res.sendStatus(404);
                req.profile = user;
                return next();
            }).catch(next);
        }
        });*/

    router.get("/:username", (req, res) => {
        logger.debug(req.params);
        res.sendStatus(200);
    });
    router.post("/:username/follow", (req, res) => {
        logger.debug(req.params);
        res.sendStatus(200);
    });

    router.delete("/:username/follow", (req, res) => {
        logger.debug(req.params);
        res.sendStatus(200);
    });

    return router;
};
