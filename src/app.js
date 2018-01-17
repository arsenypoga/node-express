//
// ──────────────────────────────────────────────────────── I ──────────
//   :::::: P A C K A G E S : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────
//
/* const bodyParser = require("body-parser");
const cors = require("cors");
const errorhandler = require("errorhandler");
const express = require("express");
const expressSession = require("express-session");
const morgan = require("morgan");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const Mockgoose = require("mockgoose-fix").Mockgoose;

 */
// Assigning app to express
import bodyParser from "body-parser";
import cors from "cors";
import errorhandler from "errorhandler";
import express from "express";
import expressSession from "express-session";
import morgan from "morgan";
import mongoose from "mongoose";
import { urls } from "./../package.json";

const app = express();
const bcrypt = require("bcrypt");
//
// ─── WINSTON LOGGER ─────────────────────────────────────────────────────────────
//

const logger = require("./logger.js");

//
// ─── REGISTER MONGOOSE MODELS ───────────────────────────────────────────────────
//

require("./models/User");
require("./models/Article");
require("./models/Comment");

if (process.env.NODE_ENV === "test") {
    logger.transports["console.debug"].silent = true;
    mongoose.set("debug", false);
}
if (process.env.NODE_ENV === "test" || process.env.NODE_ENV === "development") {
    // Turn off logging if testing
    let currentURL = urls.mongodb_test_url;

    mongoose.connect(currentURL, err => {
        err
            ? logger.error("Connection failed", err)
            : logger.info(`Connected to the ${currentURL} database`);
    });

    if (process.env.NODE_ENV === "development") {
        mongoose.set("debug", true);

        app.use(
            morgan("dev", {
                stream: logger.stream,
            })
        );
    }
}

// Disable Logging if env is test
if (process.env.NODE_ENV === "production") {
    let currentURL = urls.mongodb_production_url;
    mongoose.connect(currentURL, err => {
        err
            ? logger.error("Connection failed", err)
            : logger.info(`Connected to the {currentURL} database`);
    });
}
//
// ─── ROUTES MANAGEMENT ──────────────────────────────────────────────────────────
//

const index = require("./routes/index.js")(express, logger);

const port = process.env.PORT || 3000;
//
// ─── SET UP MIDDLEWARE ──────────────────────────────────────────────────────────
//

app.use(cors());
app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);
app.use(bodyParser.json());

// app.use(express.static())

//
// ─── MOUNT ROUTES ───────────────────────────────────────────────────────────────
//

app.use("/", index);

// Set up express-session
app.use(
    expressSession({
        secret: bcrypt.genSaltSync(16),
        cookie: {
            maxAge: 60000,
        },
        resave: false,
        saveUninitialized: false,
    })
);

// If dev use errorhadler
if (process.env.NODE_ENV === "test") app.use(errorhandler());

//
// ─── ERROR HANDLING IN PRODUCTION ───────────────────────────────────────────────
//

app.use((err, req, res, next) => {
    logger.log(err.stack);

    res.status(err.status || 500);

    res.json({
        errors: {
            message: err.message,
            error: err,
        },
    });
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        errors: {
            message: err.message,
            error: {},
        },
    });
});

//
// ─── START THE SERVER ───────────────────────────────────────────────────────────
//

app.listen(port, () => {
    logger.info(
        `Server Started on ${port} App is running in ${process.env.NODE_ENV}`
    );
});

module.exports = app;
