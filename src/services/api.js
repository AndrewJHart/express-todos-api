const axios = require('axios');

/**
 * Creates our own instance of Axios so we can easily
 * configure certain elements to suit our needs for this
 * service. Primary purpose is to set the required
 * Headers and to ensure proxy is set to false as there
 * are known issues with axios proxy configuration and
 * it is not needed here.
 *
 * @param {string} consumerId
 * @param {string} authSignature
 * @param {string} timeStamp
 * @returns {AxiosInstance} an instance of axios w/ default configuration params
 */
const proxy = (consumerId, authSignature, timeStamp) => {

    return axios.create({
        baseURL: `https://${env}.mini.cerebro.walmart.net`,
        headers: {
            'Content-Type': 'application/json'
        },
        // proxy: false
    });

};

module.exports = proxy;
