//
// ────────────────────────────────────────────────────────────── I ──────────
//   :::::: A P I   H A N D L E R : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────
//
module.exports = (express, logger) => {
    const router = express.Router();

    const users = require("./users")(express, logger);
    const profiles = require("./profiles")(express, logger);
    const articles = require("./articles")(express, logger);
    const tags = require("./tags")(express, logger);
    router.use("/", users);
    router.use("/profiles", profiles);
    router.use("/articles", articles);
    router.use("/tags", tags);

    return router;
};
