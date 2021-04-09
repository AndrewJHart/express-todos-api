
const isValid = params => params === 'yes' || 'no'


/**
 * Coerces bool to yes or no value or null to
 * a string of No Value
 *
 * @param value
 * @returns {string}
 */
const coerceBoolToYesNo = value => {
    if (value === null) {
        return 'No value';
    }

    return value ? 'yes' : 'no';
};

/**
 * Coerces yes or no string value into boolean
 *
 * @param value
 * @returns {boolean}
 */
const coerceYesNoToBool = value => {
    return value === 'yes';
};

module.exports = {
    isValid,
    coerceBoolToYesNo,
    coerceYesNoToBool
}
