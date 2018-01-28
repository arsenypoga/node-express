import mongoose from "mongoose";
const CommentSchema = new mongoose.Schema(
    {
        body: String,
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        article: { type: mongoose.Schema.Types.ObjectId, ref: "Article" },
    },
    { timestamps: true }
);

CommentSchema.methods.getComment = function(user) {
    return {
        id: this._id,
        body: this.body,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        author: this.author.getProfile(user),
    };
};

module.exports = mongoose.model("Comment", CommentSchema);
