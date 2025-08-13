const express = require("express");
const routes = express.Router();
const controllers = require("../controller/controllers.index");

// wrappers
routes.get("/cities", controllers.getCities);
// routes.get("/healthz", controllers.accessToken);

module.exports = [ routes ];