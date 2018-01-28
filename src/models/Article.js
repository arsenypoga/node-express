import mongoose from "mongoose";
import slug from "slug";

const logger = require("../logger");

const User = mongoose.model("User");

const ArticleSchema = new mongoose.Schema(
    {
        slug: { type: String, lowercase: true, unique: true },
        title: String,
        comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
        body: String,
        favoritesCount: { type: Number, default: 0 },
        tagList: [{ type: String }],
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        description: String,
    },
    { timestamps: true }
);

ArticleSchema.pre("validate", function(next) {
    if (!this.slug) this.slugify();
    next();
});

ArticleSchema.methods.slugify = function() {
    this.slug = `${slug(this.title).toString(36)}`;
};

ArticleSchema.methods.getArticle = function(user) {
    logger.debug(JSON.stringify(this.author.id));

    return {
        slug: this.slug,
        title: this.title,
        description: this.description,
        body: this.body,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        tagList: this.tagList,
        favorited: user ? user.isFavorite(this._id) : false,
        favoritesCount: this.favoritesCount,
        author: this.author.getProfile(user),
    };
};

ArticleSchema.methods.updateFavoriteCount = function() {
    return User.count({ favorites: { $in: [this._id] } }).then(count => {
        this.favoritesCount = count;
        return this.save();
    });
};

module.exports = mongoose.model("Article", ArticleSchema);
