const joi = require("joi");
const ResponseUtil = require("../utils/responseUtil");
const guruProxy = require("../proxies/bookinguru.proxy");
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * 
 * Wraper request to check login is working or not
 */
const accessToken = async function (req, res) {
    try {
        const schema = joi.object({
            username: joi.string().required(),
            password: joi.string().required()
        });

        await schema.validateAsync(req.body);

        const response = await guruProxy.getAccessToken(req.body.username, req.body.password);
        return res.status(200).json(ResponseUtil.success(response.data));
    } catch (error) {
        console.log(error);
        if (error.name === 'ValidationError') {
            return res.status(400).json(ResponseUtil.validationError(error.message));
        }
        return res.status(500).json(ResponseUtil.internalServerError())
    }
}

module.exports = {
    accessToken
}