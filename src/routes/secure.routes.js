const express = require("express");
const routes = express.Router();
const controllers = require("../controller/controllers.index");

// wrappers
routes.get("/pollution", controllers.accessToken);
routes.get("/healthz", controllers.accessToken);

module.exports = [ routes ];