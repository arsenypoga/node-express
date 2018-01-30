// ──────────────────────────────────────────────────────────────── I ──────────
//   :::::: A R T I C L E S    R O U T E S : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────
//
import mongoose from "mongoose";
import { auth } from "./../auth";
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
    router.get("/", auth.optional, (req, res, next) => {
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
            req.query.author
                ? User.findOne({ username: req.query.author })
                : null,
            req.query.favorited
                ? User.findOne({ username: req.query.favorited })
                : null,
        ]).then(data => {
            let author = data[0];

            /*let favoriter = data[1];
            favoriter
                ? (query._id = { $in: favoriter.favorites })
                : (query._id = { $in: [] });
            */

            if (author) query.author = author._id;

            return Promise.all([
                Article.find(query)
                    .limit(Number(limit))
                    .skip(Number(offset))
                    .populate("author")
                    .sort({ createdAt: "desc" })
                    .exec(),
                Article.count(query).exec(),
                req.payload ? User.findById(require.payload.id) : null,
            ])
                .then(data => {
                    let articles = data[0];
                    let count = data[1];
                    let user = data[2];

                    logger.debug("Articles: " + JSON.stringify(articles));
                    logger.debug("Articles: " + JSON.stringify(count));

                    return res.json({
                        articles: articles.map(article => {
                            return article.getArticle(user);
                        }),
                        articlesCount: count,
                    });
                })
                .catch(next);
        });
    });

    //
    // ─── FEED ARTICLES ──────────────────────────────────────────────────────────────
    //
    router.get("/feed", auth.required, (req, res) => {});

    //
    // ─── GET ARTICLE ────────────────────────────────────────────────────────────────
    //
    router.get("/:article", auth.optional, (req, res, next) => {
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
    router.post("/", auth.required, (req, res, next) => {
        User.findById(req.payload.id)
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

    router.put("/:article", auth.required, (req, res, next) => {
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
    router.delete("/:article", auth.required, (req, res) => {
        req.article.remove().then(() => {
            return res.sendStatus(204);
        });
    });

    //
    // ─── ADD COMMENT ────────────────────────────────────────────────────────────────
    //

    router.post("/:article/comments", auth.required, (req, res, next) => {
        User.findById(req.payload.id)
            .then(user => {
                if (!user) return res.sendStatus(401);

                let comment = new Comment({
                    body: req.body.comment.body,
                    author: user,
                    article: req.article,
                });

                comment.save((err, resComment) => {
                    if (err) return next(err);
                    req.article.comments.push(resComment._id);
                    logger.debug(req.article.comments);

                    req.article.save((err, article) => {
                        if (err) return next(err);
                        return res.json({ comment: comment.getComment(user) });
                    });
                });
            })
            .catch(next);
    });

    //
    // ─── GET COMMENTS ───────────────────────────────────────────────────────────────
    //

    router.get("/:article/comments", auth.optional, (req, res, next) => {
        Promise.resolve(req.payload ? User.findById(req.payload.id) : null)
            .then(user => {
                return req.article
                    .populate({
                        path: "comments",
                        populate: { path: "author" },
                        options: {
                            sort: {
                                createdAt: "desc",
                            },
                        },
                    })
                    .execPopulate()
                    .then(article => {
                        return res.json({
                            comments: req.article.comments.map(comment => {
                                return comment.getComment(user);
                            }),
                        });
                    });
            })
            .catch(next);
    });

    //
    // ─── DELETE COMMENT ──────────────────────────────────────────────────────────────
    //

    router.delete(
        "/:article/comments/:comment",
        auth.required,
        (req, res, next) => {
            if (req.comment.author.toString() === req.payload.id.toString()) {
                req.article.comments.remove(req.comment._id);
                req.article
                    .save()
                    .then(
                        Comment.find({ _id: req.comment._id })
                            .remove()
                            .exec()
                    )
                    .then(() => {
                        res.sendStatus(204);
                    });
            } else {
                res.sendStatus(403);
            }
        }
    );

    //
    // ─── FAVORITE ARTICLE ───────────────────────────────────────────────────────────
    //

    router.post("/:article/favorite", auth.required, (req, res, next) => {
        let articleId = req.article._id;

        User.findById(req.payload.id)
            .then(user => {
                if (!user) res.sendStatus(401);

                return user.favorite(articleId).then(() => {
                    return req.article.updateFavoriteCount().then(article => {
                        return res.json({ article: article.getArticle(user) });
                    });
                });
            })
            .catch(next);
    });

    //
    // ─── UNFAVORITE ARTICLE ─────────────────────────────────────────────────────────
    //
    router.delete("/:article/favorite", auth.required, (req, res, next) => {
        var articleId = req.article._id;

        User.findById(req.payload.id)
            .then(function(user) {
                if (!user) {
                    return res.sendStatus(401);
                }

                return user.unfavorite(articleId).then(() => {
                    return req.article.updateFavoriteCount().then(article => {
                        return res.json({
                            article: article.getArticle(user),
                        });
                    });
                });
            })
            .catch(next);
    });
    return router;
};
