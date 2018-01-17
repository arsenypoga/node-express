// ──────────────────────────────────────────────────────────────── I ──────────
//   :::::: A R T I C L E S    R O U T E S : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────
//
import mongoose from "mongoose";

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
            offset = Number(req.query.offset);
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
                .skip(offset)
                .populate("author")
                .sort({ createdAt: "desc" })
                .exec(),
            Article.count(query).exec(),
        ])
            .then(data => {
                let articles = data[0];
                let count = data[1];
                logger.debug("Articles: " + JSON.stringify(articles));
                logger.debug("Articles: " + JSON.stringify(count));
                return res.json({
                    articles: articles.map(article => {
                        return article.getArticle(null);
                    }),
                    articlesCount: count,
                });
            })
            .catch(next);
    });

    //
    // ─── FEED ARTICLES ──────────────────────────────────────────────────────────────
    //
    router.get("/feed", (req, res) => {});

    //
    // ─── GET ARTICLE ────────────────────────────────────────────────────────────────
    //
    router.get("/:article", (req, res, next) => {
        logger.debug("/:article");

        Promise.all([req.article.populate("author").execPopulate()])
            .then(() => {
                return res.json({ article: req.article.getArticle(null) });
            })
            .catch(next);
    });

    //
    // ─── CREATE ARTICLE ─────────────────────────────────────────────────────────────
    //
    router.post("/", (req, res, next) => {
        User.findById(req.body.payload.id)
            .then(user => {
                if (!user) logger.error(user);

                const article = new Article(req.body.article);

                article.author = user;

                article.save((err, data) => {
                    if (err) logger.error(err);
                    if (!err)
                        return res.json({ article: data.getArticle(user) });
                });
            })
            .catch(next);
    });

    //
    // ─── UPDATE ARTICLE ─────────────────────────────────────────────────────────────
    //

    router.put("/:article", (req, res, next) => {
        if (typeof req.body.article.title !== "undefined")
            req.article.title = req.body.article.title;

        if (typeof req.body.article.description !== "undefined")
            req.article.description = req.body.article.description;
        if (typeof req.body.article.body !== "undefined")
            req.article.body = req.body.article.body;
        if (typeof req.body.article.tagList !== "undefined")
            req.article.tagList = req.body.article.tagList;

        req.article
            .save()
            .then(article => {
                return res.json({ article: article.getArticle(null) });
            })
            .catch(next);
    });

    //
    // ─── DELETE ARTICLE ─────────────────────────────────────────────────────────────
    //
    router.delete("/:article", (req, res) => {});

    //
    // ─── ADD COMMENT ────────────────────────────────────────────────────────────────
    //

    router.post("/:article/comments", (req, res) => {});

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
