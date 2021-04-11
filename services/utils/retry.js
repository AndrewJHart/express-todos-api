/**
 * Default axios-retry configuration; however, it does require a per-instance
 * reference to be set when axios instances are used so this is just the basic
 * config for import & the request must set the reference after axios instantiation.
 */
const retryConfig = {
    retry: 3,  // Retry 3 times on requests that return a response (500, etc)
    noResponseRetries: 2,   // Retry twice on no response (ENOTFOUND, ETIMEDOUT, etc).
    httpMethodsToRetry: ['POST', 'HEAD', 'OPTIONS'], // HTTP methods to retry
    statusCodesToRetry: [[100, 199], [404, 404], [429, 429], [500, 599]],
    onRetryAttempt: err => console.log(`Retrying request`, err.toString())
};

module.exports = retryConfig;
