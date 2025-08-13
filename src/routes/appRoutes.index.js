const express = require("express");
const appRoutes = express.Router();

const [ authRoutes ] = require("./auth.routes");
const [ secureRoutes ] = require("./secure.routes");

appRoutes.use("/auth", authRoutes);

appRoutes.use("/secure", secureRoutes);

module.exports = {
    appRoutes
}
