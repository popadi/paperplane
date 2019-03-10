/**
 *
 * @param res
 */
exports.solveCorsProblems = function (res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype');
    res.setHeader('Access-Control-Allow-Credentials', true);
};

/**
 *
 * @param user
 * @returns {any}
 */
exports.clearPassword = function (user) {
    let cleaned = JSON.parse(JSON.stringify(user));
    if (cleaned.hasOwnProperty("password")) {
        delete cleaned.password;
    }

    return cleaned;
};

/**
 *
 * @param users
 * @returns {Array}
 */
exports.clearPasswords = function (users) {
    let cleaned = [];
    users.forEach(user => {
        user = exports.clearPassword(user);
        cleaned.push(user);
    });

    return cleaned;
};

