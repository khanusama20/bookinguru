const ExecuteHttpRequest = require('../../helper/executeRequest.helper');
/*
    You can controll headers from the center place
*/
const guruRequest = new ExecuteHttpRequest()
    guruRequest.setHeaders({
        'accept': 'application/json',
        'Content-Type': 'application/json'
    });

module.exports = guruRequest