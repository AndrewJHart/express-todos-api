const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const UsersService = require('../services/users');
const router = express.Router();  // instantiate router for this endpoint
require('dotenv').config();

/**
 * Takes a payload for resource, validates, and
 * hands it off the service/controller. Using promises
 * here intentionally. The services use async/await.
 *
 * @implements express.Router()
 * @method POST - handler for http POST requests from the frontend
 * @returns {Response} json response
 */
router.post('/register', (req, res) => {
    const { email, password } = req.body;

    UsersService
        .create(email, password)
        .then(response => {
            return res.status(201).json({
                username: response.dataValues.username,
                email: response.dataValues.email
            })
        })
        .catch(error => {
            console.log(error);
            return error?.status
                ? res.status(error.status).json({
                    msg: error.statusText
                })
                : res.status(500).json({
                    msg: 'Server Error'
                })
        })
});

/**
 * Calls service to authenticate the current user
 * and sign the json web token with needed data,
 * returning the token if successful
 *
 * @implements express.Router()
 * @method get - handler for http get requests
 * @returns {Response} json response
 */
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    email && password
        ? UsersService
            .auth({ email, password })
            .then(user => {
                // build token payload
                const payload = { id: user.id, email: user.email, isAdmin: user.isAdmin };

                // sign the token
                const token = jwt.sign(payload, process.env.JWT_SECRET);

                return res.json({
                    msg: 'Success',
                    token: token
                })
            })
            .catch(err => {
                console.log(err);

                return res.status(401).json({
                    msg: err.toString()
                });
            })
        : res.status(400).json({ msg: 'Bad Request'})
})

/**
 * Calls service to get list of all todoItems
 * and allows for filtering with query params
 * for the completed field (at present)
 *
 * @implements express.Router()
 * @method get - handler for http get requests
 * @returns {Response} json response
 */
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (req.user.isAdmin) {
        const clause = {
            where: { ...req.query }
        };

        return UsersService
            .list(clause)
                .then(data => res.send(data))
                .catch((_) =>
                    res.status(500).json({
                        msg: 'Server Error',
                    })
                );
    } else {
        res.status(403).json({
            msg: 'Forbidden, unauthorized.'
        })
    }
});

/**
 * Get info for single user if user requesting data is user
 *
 * @implements express.Router()
 * @method get - handler for http get requests
 * @returns {Response} json response
 */
router.get('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (req.user.isAdmin) {
        const id = req.params?.id && Number(req.params.id);

        Number.isNaN(id)
            ? res.status(400).json({ msg: 'Bad Request' })
            : UsersService
            .detail(id)
            .then(result => {
                return result
                    ? res.send(result)
                    : res.status(404).json({ msg: '404 Not Found' });
            })
            .catch(error => {
                return res.status(500).json({
                    msg: 'Server Error',
                    details: error.toString()
                });
            })
    } else {
        res.status(403).json({
            msg: 'Forbidden, unauthorized.'
        })
    }
});

module.exports = router;
