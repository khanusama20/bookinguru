const wikiPediaRequest = require("./config/wiki.request");

const getWikipediaSummary = city => {
   
    return new Promise ((resolve, reject) => {
        const url = `${process.env.WIKI}/api/rest_v1/page/summary/${encodeURIComponent(city)}`;
        
        wikiPediaRequest
            .setURL(url)
            .setMethod('GET')
            .execute((error, res) => {
                if (error) {
                    reject(error);
                } else {
                    if (res.data.type == "standard") {
                        resolve(res.data);
                    } else {
                        resolve(null);
                    }
                }
            });
    })
}


module.exports = {
    getWikipediaSummary
}