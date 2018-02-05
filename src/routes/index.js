import listEndpoints from "express-list-endpoints";

module.exports = (express, logger) => {
    const api = require("./api/index")(express, logger);

    const router = express.Router();
    router.use("/api", api);
    router.get("/statistics", (req, res, next) => {
        logger.debug(listEndpoints(router));
        return res.render("statistics.pug", {
            endpoints: listEndpoints(router),
        });
    });

    return router;
};
