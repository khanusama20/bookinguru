const ExecuteHttpRequest = require('../../helper/executeRequest.helper');
/*
    You can controll headers from the center place
*/
const wikiRequest = new ExecuteHttpRequest();
    wikiRequest.setHeaders({
        'User-Agent': 'PollutionChecker/1.0',
        'accept': 'application/json',
        'Content-Type': 'application/json'
    });

module.exports = wikiRequest