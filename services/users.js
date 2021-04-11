const bcrypt = require('bcrypt');
const db = require('../models');
const User = db.User;
const Op = db.Sequelize.Op;

/**
 * Authenticates a user by checking if user exists
 * and then comparing hashes. Either promisify bcrypt
 * with library or wrap in promise to resolve properly
 * regardless of compare or compareSync
 *
 * @param {string} email
 * @param {string} password
 * @return {Promise<*>}
 */
const auth = ({ email, password }) => {
    return new Promise((resolve, reject) =>
        User
            .findOne({ where: { email }})
            .then(({ dataValues }) => {
                const result = bcrypt.compareSync(password, dataValues.password);

                if (result) {
                    resolve(dataValues);
                } else {
                    reject(new Error('Incorrect Password'))
                }
            })
            .catch(e => {
                console.log('in service error is, ', e);
                return new Error(e);
            })
    )
}

/**
 * POST request handler for creation of a todoItem resource
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<[<Object>]>}
 */
const create = async (email, password) => {
    try {
        return await User.create({
            username: email.split('@')[0],
            email: email,
            password: bcrypt.hashSync(password, 10)
        });
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
        await User.update(data, { where: { id }})
        return await User.findByPk(id, { attributes: { exclude: ['password', 'isAdmin'] }});

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
        return await User.findAll({ ...clause, attributes: { exclude: ['password', 'isAdmin'] }});
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
        return await User.findByPk(id, { attributes: { exclude: ['password', 'isAdmin'] }});
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
        return await User.destroy({ where: { id }});
    } catch (e) {
        throw e;
    }
}

// configure as service object so other methods can be added later if needed
const UsersService = {
    auth,
    create,
    update,
    list,
    detail,
    remove,
};

module.exports = UsersService;
