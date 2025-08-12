const express = require("express");
const routes = express.Router();
const controllers = require("../controller/controllers.index");

appSecureRoutes.post("/access-token", controllers.accessToken);
appSecureRoutes.post("/refresh-token", controllers.accessToken);

module.exports = [ routes ];