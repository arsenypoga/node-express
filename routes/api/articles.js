// ──────────────────────────────────────────────────────────────── I ──────────
//   :::::: A R T I C L E S    R O U T E S : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────
//
const Chance = require("chance");
const chance = Chance();

module.exports = (express, logger) => {
    const router = express.Router();

    //
    // ───LIST ARTICLES  ───────────────────────────────────────────────────────────────────────────
    //
    router.get("/", (req, res) => {});

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
    router.post("/", (req, res) => {});

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
};
