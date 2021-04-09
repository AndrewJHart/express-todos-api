const db = require('../models');
const Todo = db.Todo;
const Op = db.Sequelize.Op;

/**
 * POST request handler for creation of a todo resource
 *
 * @param {Object} data
 * @returns {Promise<[<Object>]>}
 */
const create = async data => {
    try {
        await Todo.create(data);
    } catch (e) {
        throw e;
    }
};

/**
 *
 * @param {Number} id
 * @param {Object} data
 * @return {Promise<[number, Model[]]>}
 */
const update = async (id, data) => {
    try {
        return await Todo.update(data, { where: { id }});
    } catch (e) {
        throw e;
    }
}

/**
 * Queries full list of entries with possible query
 * params given in where clause as filters
 *
 * @param {Object} clause
 * @return {Promise<Model[]>}
 */
const list = async clause => {
    try {
        return await Todo.findAll(clause);
    } catch (e) {
        throw e;
    }
}

/**
 * Get resource by unique id / primary key
 *
 * @param {Number} id
 * @return {Promise<Model<any, TModelAttributes>>}
 */
const detail = async id => {
    try {
        return await Todo.findByPk(id);
    } catch (e) {
        throw e;
    }
}

/**
 * Delete request - attempts to removes the resource
 *
 * @param {Number} id
 * @return {Promise<number>}
 */
const remove = async id => {
    try {
        return await Todo.destroy({ where: { id }});
    } catch (e) {
        throw e;
    }
}

// configure as service object so other methods can be added later if needed
const TodosService = {
    create,
    update,
    list,
    detail,
    remove,
};

module.exports = TodosService;
