const express = require("express");
const routes = express.Router();
const controllers = require("../controller/controllers.index");

routes.post("/access-token", controllers.accessToken);
// routes.post("/refresh-token", controllers.accessToken);

module.exports = [ routes ];
