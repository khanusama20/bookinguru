const joi = require("joi");
const ResponseUtil = require("../utils/responseUtil");
const guruProxy = require("../proxies/bookinguru.proxy");
const wikipediaProxy = require("../proxies/wikipedia.proxy");
const utils = require("../utils/utils");

const getCities = async function (req, res) {
    try {
        console.log("Cities request");
        const schema = joi.object({
            countryCode: joi.string()
        });

        await schema.validateAsync(req.query);
        let country_code = req.query.countryCode;
        let pageNo = 1;
    
        // Step 1
        const response = await guruProxy.getPollution(country_code, pageNo);
        
        let totalPages = response.data.meta.totalPages;
        const result = response.data.results;

        if (result.length == 0) {
            return res.status(200).json(ResponseUtil.notFound());
        }

        let wikiPPromises = [];
        const filteredCities = [];
        
        result.forEach(item => {
            let citiName = utils.cleanCityName(item.name);
            if (citiName) {
                filteredCities.push({
                    ...item,
                    country: "",
                    description: "",
                    name: citiName
                });
                wikiPPromises.push(wikipediaProxy.getWikipediaSummary(citiName))
            }
        });

        if (wikiPPromises.length > 0) {
            const results = await Promise.all(wikiPPromises);
            return res.status(200).json(ResponseUtil.success(results));
        }

        return res.status(200).json(ResponseUtil.notFound());
    } catch (error) {
        console.log(error)
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