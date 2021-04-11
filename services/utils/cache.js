const cache = require('memory-cache');

/**
 * @description Normally caching would be used in a middleware capacity,
 *      however here it is used not for caching responses to consumer
 *      but for caching generation of complex auth signatures for
 *      header requirements that only last 1 minute after creation. A
 *      better extension of this library would be to take memory-cache,
 *      wrap it in a HOF or class to take a callback param that invokes
 *      the request. This way, any service could set the TTL, what to cache,
 *      and also pass the request to proxy - making it reusable.
 */

// if running locally w/ npm run dev, enable cache debugging
process.env?.CACHE_DEBUG
    ? cache.debug(true)
    : cache.debug(false);

/**
 * checks cache for a valid signature & timestamp to use for service to service
 * calls or falls back to creating them & caching the values for 45 seconds.
 *
 * auth signatures lasts ~60 seconds before invalidation. This function
 * uses a memory caching library to re-use the cached values for all requests
 * within the ttl window to prevent re-generating signature per-request/per-ttl.
 *
 * @note this should only be used in a per-request fashion and not on a separate interval
 *
 * @param {String} consumerId - your consumer id for your application
 * @param {String} pkPath - path to the location of your private key file
 * @param {Number} ttl - time in *SECONDS* till cache expires; default 45 seconds
 * @return {String[]|Array<[string, string]>} packs signature & timestamp into array
 */
const getOrCreateSignature = (consumerId, pkPath, ttl = 45) => {
    const sigAndTimeStamp = cache.get('authSigTS') || null;

    // cache miss, generate sig & cache it
    if (!sigAndTimeStamp) {
        // generate auth signature & timestamp - requires consumerId & path to private key
        // const [authSignature, timeStamp] = generateSignature(consumerId, '/etc/secrets/pk');

        // cache sig & ts for given ttl
        // cache.put('authSigTS', [authSignature, timeStamp], (ttl * 1000));
        //
        // return [authSignature, timeStamp];
    }

    return sigAndTimeStamp;  // return cache hit
};

module.exports = getOrCreateSignature;
