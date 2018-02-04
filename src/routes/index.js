import app from "../app";
import listEndpoints from "express-list-endpoints";

module.exports = (express, logger) => {
    const api = require("./api/index")(express, logger);

    const router = express.Router();

    router.get("/statistics", (req, res, next) => {
        logger.debug(listEndpoints(app));
        return res.render("statistics.pug", { endpoints: listEndpoints(app) });
    });

    router.use("/api", api);
    return router;
};
