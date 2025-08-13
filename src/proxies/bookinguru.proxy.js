const guruRequest = require("./config/guruClient.request")

const getAccessToken = async (user, pass) => {
    const baseURL = `${process.env.BASE_URL}${process.env.LOGIN_URL}`;
    const result = await guruRequest
    .setURL(baseURL)
    .setMethod('POST')
    .setData({
        "username": user ? user : process.env.USER_NAME,
        "password": pass ? pass : process.env.testpass
    }).execute()

    return result;
}

module.exports = {
    getAccessToken
}