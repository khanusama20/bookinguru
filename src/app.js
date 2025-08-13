const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const md = require("./middleware/middlewares.index");
const { appRoutes } = require("./routes/appRoutes.index");

// Parse JSON bodies
app.use(bodyParser.json());

// Parse URL-encoded form bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", md.requestLogger);
app.use("/app/bookin-guru", appRoutes);

module.exports = app;
