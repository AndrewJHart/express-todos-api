const express = require('express');
const passport = require('passport');
const TodosService = require('../services/todos');
const router = express.Router();  // instantiate router for this endpoint

/**
 * Takes a payload for resource, validates, and
 * hands it off the service/controller. Using promises
 * here intentionally. The services use async/await.
 *
 * @implements express.Router()
 * @method POST - handler for http POST requests from the frontend
 * @returns {Response} json response
 */
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    // get user id for current authenticated request & use it for query
    const user = req.user.id;
    const title = req.body?.title || null;

    // ensure body is valid as title is only required field
    if (title && user) {
        TodosService
            .create({ title, user })
            .then(response => {
                return res.status(201).json({
                    ...response.dataValues
                })
            })
            .catch(error => {
                return error?.status
                    ? res.status(error.status).json({
                        msg: error.statusText
                    })
                    : res.status(500).json({
                        msg: 'Server Error'
                    })
            })
    } else {
        // inform user request is malformed
        return res.status(400).json({
            msg: 'Bad Request'
        });
    }
});

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
    // get user id for current authenticated request & use it for query
    const userId = req.user.id;

    // build clause from query params
    // note - some sanitization should be added
    const clause = {
        where: { ...req.query, user: userId }
    };

    return TodosService
        .list(clause)
            .then(data => res.send(data))
            .catch((_) =>
                res.status(500).json({
                    msg: 'Server Error',
                })
            );
});


router.get('/:id', (req, res) => {
    const id = req.params?.id && Number(req.params.id);

    Number.isNaN(id)
        ? res.status(400).json({ msg: 'Bad Request' })
        : TodosService
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
});

/**
 * Gets detail data for single resource
 *
 * @implements express.Router()
 * @method put - handler for http update requests
 * @returns {Response} json response
 */
router.put('/:id', (req, res) => {
    const id = req.params?.id && Number(req.params.id);

    Number.isNaN(id)
        ? res.status(400).json({ msg: 'Bad Request' })
        : TodosService
            .update(id, req.body)
            .then(data => res.json(data))
            .catch(err => {
                return res.status(500).json({
                    msg: 'Server Error',
                    details: err.toString()
                });
            })
});

/**
 * deletes a single resource
 *
 * @implements express.Router()
 * @method delete - handler for http delete requests
 * @returns {Response} json response
 */
router.delete('/:id', (req, res) => {
    const id = req.params?.id && Number(req.params.id);

    Number.isNaN(id)
        ? res.status(400).json({ msg: 'Bad Request' })
        : TodosService
            .remove(id)
            .then(response => {
                return response === 1
                    ? res.status(200).json({ msg: 'resource deleted' })
                    : res.status(404).json({ msg: 'resource not found' })
            })
            .catch(err => {
                return res.status(500).json({
                    msg: 'Server Error',
                    details: err.toString()
                });
            })
});

module.exports = router;
