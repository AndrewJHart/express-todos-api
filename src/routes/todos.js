const express = require('express');
const TodosService = require('../services/todos');
const isValid = require('../utils/utils').isValid;
const coerce = require('../utils/utils').coerceYesNoToBool;
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
router.post('/', (req, res) => {
    // ensure body is valid as title is only required field
    if (req.body?.title) {
        // relay call to Cerebro upstream predict service
        TodosService
            .create(req.body)
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
router.get('/', (req, res) => {
    // check for query params used to filter on api
    const isCompleted = req.query?.completed;
    const priority = req.query?.priority;
    let clause = {
        where: {}
    };
    // const clause = isCompleted
    //     ? {where: {'completed': isCompleted}}
    //     : {};

    clause = typeof isCompleted === 'string' && isValid(isCompleted)
        ? clause.where = { 'completed': coerce(isCompleted) }
        : clause

    return TodosService
        .list(clause)
        .then(data => res.send(data))
        .catch(() =>
            res.status(500).json({
                msg: 'Server Error',
            })
        );
});


router.get('/:id', (req, res) => {
    const id = req.params?.id && Number(req.params.id);

    Number.isNaN(id)
        ? res.status(401).json({ msg: 'Bad Request' })
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
 * Not used, returns 405 in Restful fashion as endpoint
 * represents a resource but can not be communicated with
 * in this way
 *
 * @implements express.Router()
 * @method put - handler for http update requests
 * @returns {Response} 405 & json response
 */
router.put('/:id', (req, res) => {
    const id = req.params?.id && Number(req.params.id);

    Number.isNaN(id)
        ? res.status(401).json({ msg: 'Bad Request' })
        : TodosService
            .update(id, req.body)
            .then(data => {
                console.log(data);
                res.json(data)
            })
            .catch(err => {
                return res.status(500).json({
                    msg: 'Server Error',
                    details: err.toString()
                });
            })
});

/**
 * Not used, returns 405 in Restful fashion as endpoint
 * represents a resource but can not be communicated with
 * in this way
 *
 * @implements express.Router()
 * @method delete - handler for http delete requests
 * @returns {Response} 405 & json response
 */
router.delete('/:id', (req, res) => {
    const id = req.params?.id && Number(req.params.id);

    Number.isNaN(id)
        ? res.status(401).json({ msg: 'Bad Request' })
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
