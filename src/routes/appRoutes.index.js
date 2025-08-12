const express = require("express");

const appAuthRoutes = express.Router();
const appSecureRoutes = express.Router();

const controllers = require("../controller/controllers.index");

appAuthRoutes.post("/access-token", controllers.accessToken)
