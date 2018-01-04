//
// ────────────────────────────────────────────────────────────── I ──────────
//   :::::: A P I   H A N D L E R : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────
//
module.exports = (express, logger) => {
    const users = require('./users')(express, logger);
    const router = express.Router();
    router.use('/', users);

    return router;
}