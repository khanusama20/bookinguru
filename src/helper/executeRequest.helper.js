const axios = require('axios');

class ExecuteHttpRequest {
    constructor () {
        this.headers = {}
        this.data = {};
        this.config = {};
        this.apiLoger = {};
        this.url = '';
        this.method = 'GET';
    }

    setURL(url) {
        this.url = url;
        return this;
    }

    setMethod(method) {
        this.method = method;
        return this;
    }

    setHeaders (header) {
        this.headers = {
            ...this.headers,
            ...header
        };
        return this;
    }

    setAuhToken(token) {
        this.headers = {
            ...this.headers, "Authorization": token
        }
        return this;
    }

    setBearerToken(token) {
        this.headers = {
            ...this.headers, "Authorization": "Bearer".concat(" ").concat(token)
        }
        return this;
    }

    setData (data) {
        this.data = data;
        return this;
    }

    async execute(cb) {
        let config = {
            method: this.method,
            url: this.url,
            headers: this.headers,
            data: this.data
        };

        try {
            const response = await axios(config);
            if (typeof cb === "function") {
                cb(null, response);
            } else {
                return response;
            }
        } catch (error) {
            if (typeof cb === "function") {
                cb(error, null);
            } else {
                throw error;
            }
        }
    }
}

module.exports = ExecuteHttpRequest;