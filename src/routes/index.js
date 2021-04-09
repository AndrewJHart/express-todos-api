const express = require('express');
const router = express.Router();

/**
 * Handler mounted at root / route of the
 * application. This can be deleted & unmounted
 * in app.js so the middleware will return a 404
 * on its own but I've left it in for local testing
 * or in the event its needed for redirect, etc..
 *
 * @methodOf express.Router
 * @method get
 * @returns {Response} 404 & json response
 */
router.get('/', (req, res) =>
  res.status(404).json({
    msg: 'No resource exists here'
  })
);

module.exports = router;
