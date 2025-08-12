const pollutionController = require("./pollutionDataController");
const authController = require("./authController");

module.exports = {
    ...pollutionController,
    ...authController
}