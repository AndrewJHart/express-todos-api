const db = require('../models');
const User = db.User;

/**
 *  * Get resource by unique id / primary key
 *
 * @note this will return null instead of catching as error
 *      if nothing is found
 * @param id
 * @return {Promise<*|null>}
 */
const getUser = async id => {
    const user = await User.findByPk(id, { attributes: { exclude: ['password'] }});

    return user !== null
        ? user.dataValues
        : null;
}

module.exports = {
    getUser
}
