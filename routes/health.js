const express = require('express');
const router = express.Router();

/**
 * Health endpoint for WNCP monitoring
 *
 * @desc exposes GET endpoint that should always return 200
 * @type method for handling GET requests
 * @methodOf Express.Router() instance
 * @method get - http GET request handler w/ cb
 * @returns JSON response w/ status code 200 & simple msg
 */
router.get('/', (req, res) =>
    res.status(200).json({
        msg: 'success'
    })
);

module.exports = router;
