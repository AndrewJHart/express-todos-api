const db = require('../models');
const Todo = db.Todo;
const Op = db.Sequelize.Op;

/**
 * POST request handler for creation of a todoItem resource
 *
 * @param {Object} data
 * @returns {Promise<[<Object>]>}
 */
const create = async data => {
    try {
        return await Todo.create(data)
    } catch (e) {
        throw e;
    }
};

/**
 *
 * @param id
 * @param data
 * @return {Promise<*>}
 */
const update = async (id, data) => {
    try {
        await Todo.update(data, { where: { id }})
        return await Todo.findByPk(id, { attributes: { exclude: ['user'] }});

        // return data;  // update was successful so return given data (unfortunately this does not return full obj)
    } catch (e) {
        throw e;
    }
}

/**
 * Queries full list of entries with possible query
 * params given in where clause as filters
 *
 * @param {Object} clause
 * @returns {Promise<Model[]>}
 */
const list = async clause => {
    try {
        return await Todo.findAll({ ...clause, attributes: { exclude: ['user'] }});
    } catch (e) {
        throw e;
    }
}

/**
 * Get resource by unique id / primary key
 *
 * @note this will return null instead of catching as error
 *      if nothing is found
 * @param {Number} id
 * @returns {Promise<Model<any, TModelAttributes>>}
 */
const detail = async id => {
    try {
        return await Todo.findByPk(id, { attributes: { exclude: ['user'] }});
    } catch (e) {
        throw e;
    }
}

/**
 * Delete request - attempts to removes the resource
 *
 * @param {Number} id
 * @returns {Promise<number>}
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
