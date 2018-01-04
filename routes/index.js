module.exports = (express, logger) => {
    const api = require('./api/index')(express, logger);

    const router = express.Router();

    router.get('/', (req, res) => {
        res.status(200);
        res.end();
    });

    router.use('/api', api);
    return router;
}