//
// ────────────────────────────────────────────────────────────── I ──────────
//   :::::: A P I   H A N D L E R : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────
//
module.exports = (express, logger) => {
    const users = require("./users")(express, logger);
    const profiles = require("./profiles")(express, logger);
    const router = express.Router();
    router.use("/", users);
    router.use("/profiles", profiles);

    return router;
};
