const joi = require("joi");
const ResponseUtil = require("../utils/responseUtil");
const guruProxy = require("../proxies/bookinguru.proxy");

const getCities = async function (req, res) {
    try {
        console.log("Cities request");
        const schema = joi.object({
            countryCode: joi.string(),
            pageNo: joi.string(),
            limit: joi.string()
        });

        await schema.validateAsync(req.query);

        let country_code = req.query.countryCode;
        let pageNo = req.query.pageNo;
        let limit = req.query.limit;

        const tokenResponse = await guruProxy.getAccessToken();
        
        if (tokenResponse.status == 200) {
            let accessToken = tokenResponse.data.token;
            console.log("Access Token " , accessToken);
            const response = await guruProxy.getPollution(accessToken, country_code, pageNo, limit);
            return res.status(200).json(ResponseUtil.success(response.data));
        } else {
            return res.status(200).json(ResponseUtil.success([]));
        }
    } catch (error) {
        if (error.response) {
            return res.status(error.response.status).json(ResponseUtil.info(error.response.data));
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json(ResponseUtil.validationError(error.message));
        } 
        return res.status(500).json(ResponseUtil.internalServerError())
    }
}

module.exports = {
    getCities
}