const express = require("express");
const app = express();
const md = require("./middleware/middlewares.index");

app.use("/", md.requestLogger);

module.exports = app;
