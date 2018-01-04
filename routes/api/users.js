//
// ──────────────────────────────────────────────────────────────── I ──────────
//   :::::: U S E R S   R O U T E S : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────
//
const Chance = require('chance')
const chance = Chance();

module.exports = (express, logger) => {
    const router = express.Router();


    //
    // ─── AUTHENTIFICATION ───────────────────────────────────────────────────────────
    //    
    router.post('/users/login', (req, res) => {
        logger.debug("Request body: " + req.body.toString());

        if (!req.body.user.email) {
            return res.status(422).json({errors: {email: "can't be blank" }})
        }

        if (!req.body.user.password) {
            return res.status(422).json({errors: {password: "can't be blank" }})            
        }
//TODO: Get user from the database
        return res.status(200).json({
            'user': {
                'email': req.body.user.email,
                'token': chance.guid(),
                'username': chance.email().split("@", 0),
                'bio': "Mios dio",
                image: null
            }});
    });

    //
    // ─── REGISTRATION ───────────────────────────────────────────────────────────────
    //
    router.post('/users', (req, res) => {
        logger.debug("Request body: " + req.body);
        res.status(200).json();
    });

    return router;
};