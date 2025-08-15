const guruRequest = require("./config/guruClient.request");

const getAccessToken = async (user, pass) => {
    const baseURL = `${process.env.BASE_URL}${process.env.LOGIN_URL}`;
    const result = await guruRequest
    .setURL(baseURL)
    .setMethod('POST')
    .setData({
        "username": user ? user : process.env.USER_NAME,
        "password": pass ? pass : process.env.ACCESS_KEY
    }).execute()

    return result;
}

const getPollution = async (countryCode, pageNo) => {
    let baseURL = `${process.env.BASE_URL}${process.env.POLLUTION_DATA}`;
    let queryParams = [];
    
    if (countryCode) {
        queryParams.push(`country=${countryCode}`);
    }
    
    if (pageNo) {
        queryParams.push(`page=${pageNo}`);
    }
    
    // if (limit) {
    //     queryParams.push(`limit=${limit}`);
    // }
    
    queryParams.forEach((param, index) => {
        if (index == 0) {
            baseURL += `?${param}`;
        } else {
            baseURL += `&${param}`;
        }
    });

    console.log("Pollution get " + baseURL);

    const tokenResponse = await getAccessToken();
    const result = await guruRequest
    .setURL(baseURL)
    .setMethod('GET')
    .setBearerToken(tokenResponse.data.token)
    .execute()

    return result;
}



module.exports = {
    getAccessToken,
    getPollution
}