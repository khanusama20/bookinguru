const express = require("express");
const app = express();
const md = require("./middleware/middlewares.index");
const { appRoutes } = require("./routes/appRoutes.index");

app.use("/", md.requestLogger);
app.use("/app/bookin-guru", appRoutes);

module.exports = app;
