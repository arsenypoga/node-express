// ──────────────────────────────────────────────────────────────── I ──────────
//   :::::: A R T I C L E S    R O U T E S : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────
//
const Chance = require("chance");
const chance = Chance();
const mongoose = require("mongoose");
const Article = mongoose.model("Article");
const Comment = mongoose.model("Comment");
const User = mongoose.model("User");

module.exports = (express, logger) => {
    const router = express.Router();

    //
    // ─── PARAMS ─────────────────────────────────────────────────────────────────────
    //

    router.param("article", (req, res, next, slug) => {
        Article.findOne({ slug: slug })
            .populate("author")
            .then(article => {
                if (!article) return res.sendStatus(404);

                req.article = article;
                return next();
            })
            .catch(next);
    });

    router.param("comment", (req, res, next, id) => {
        Comment.findById(id)
            .then(comment => {
                if (!comment) return res.sendStatus(404);

                req.comment = comment;
                return next();
            })
            .catch(next);
    });

    //
    // ───LIST ARTICLES  ───────────────────────────────────────────────────────────────────────────
    //
    router.get("/", (req, res, next) => {
        let query = {};
        let limit = 20;
        let offset = 0;
        let tags = [];

        if (typeof req.query.limit !== "undefined") {
            limit = Number(req.query.limit);
        }

        if (typeof req.query.offset !== "undefined") {
            offset = req.query.offset;
        }

        if (typeof req.query.tag !== "undefined") {
            query.tagList = req.query.tag.split(" ");
        }

        logger.debug(
            `limit : ${limit}, Offset : ${offset}, Query Tags : ${JSON.stringify(
                tags
            )}`
        );

        Promise.all([
            Article.find(query)
                .limit(limit)
                .skip(Number(offset))
                .sort({ createdAt: "desc" })
                .exec(),
            Article.count(query).exec(),
        ])
            .then(data => {
                let articles = data[0];
                let count = data[1];
                logger.debug(articles, data);

                return res.json({
                    articles: articles.map(article => {
                        return article.getArticle(false);
                    }),
                    articlesCount: count,
                });
            })
            .catch(next);
        res.sendStatus(200);
    });

    //
    // ─── FEED ARTICLES ──────────────────────────────────────────────────────────────
    //
    router.get("/feed", (req, res) => {});

    //
    // ─── GET ARTICLE ────────────────────────────────────────────────────────────────
    //
    router.get("/:slug", (req, res) => {});

    //
    // ─── CREATE ARTICLE ─────────────────────────────────────────────────────────────
    //
    router.post("/", (req, res, next) => {
        User.findById(req.body.payload.id)
            .then(data => {
                logger.debug(req.body);
                if (!data) return res.sendStatus(401);

                let article = new Article(req.body.article);

                article.author = data;

                return article.save().then(() => {
                    return res.json({ article: article.getArticle(data) });
                });
            })
            .catch(next);
    });

    //
    // ─── UPDATE ARTICLE ─────────────────────────────────────────────────────────────
    //

    router.put("/:slug", () => {});

    //
    // ─── DELETE ARTICLE ─────────────────────────────────────────────────────────────
    //
    router.delete("/:slug", (req, res) => {});

    //
    // ─── ADD COMMENT ────────────────────────────────────────────────────────────────
    //

    router.post("/:slug/comments", (req, res) => {});

    //
    // ─── GET COMMENTS ───────────────────────────────────────────────────────────────
    //

    router.get("/:slug/comments", (req, res) => {});

    //
    // ─── DELETE COMMENT ──────────────────────────────────────────────────────────────
    //

    router.delete("/:slug/comments/:id", (req, res) => {});

    //
    // ─── FAVORITE ARTICLE ───────────────────────────────────────────────────────────
    //

    router.post("/:slug/favorite", (req, res) => {});

    //
    // ─── UNFAVORITE ARTICLE ─────────────────────────────────────────────────────────
    //
    router.delete("/:slug/favorite", (req, res) => {});
    return router;
};
