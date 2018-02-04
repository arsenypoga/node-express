//
// ────────────────────────────────────────────────────────────── I ──────────
//   :::::: T A G S   R O U T E S : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────
//

import mongoose from "mongoose";
const Article = mongoose.model("Article");

module.exports = (express, logger) => {
    const router = express.Router();

    router.get("/", (req, res, next) => {
        Article.find()
            .distinct("tagList")
            .then(tags => {
                return res.json({ tags: tags });
            })
            .catch(next);
    });

    return router;
};
