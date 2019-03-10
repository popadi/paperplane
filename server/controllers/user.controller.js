const userService = require('../services/user.service');
const utilsService = require('../utils/utilsService');
const user = require('../services/user.service');
_this = this;

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*|JSON|Promise<any>>}
 */
exports.authenticate = async function (req, res, next) {
    utilsService.solveCorsProblems(res);
    let query = {
        username: req.query.username,
        password: req.query.password
    };

    try {
        userService.authenticateUser(query).then(data => {
            if (data !== null) {
                data = utilsService.clearPassword(data);
                return res.status(201).json({
                    message: "success",
                    status: 201,
                    user: data
                });
            } else {
                return res.status(404).json({
                    status: 404,
                    message: "fail"
                });
            }
        });
    } catch (e) {
        return res.status(400).json({
            status: 400,
            message: "Error" + e
        });
    }
};


/**
 * Creates a new user and returns the newly created object.
 * Some default data is used to populate the object.
 */
exports.createUser = async function (req, res, next) {
    utilsService.solveCorsProblems(res);

    let newuser = {
        username: req.query.username,
        password: req.query.password,

        firstName: req.query.firstName || "",
        lastName: req.query.lastName || "",

        groups: [],
        friends: [],
        avatar: "http://www.prichal.in.ua/wp-content/uploads/2015/10/default-avatar-4-l.jpg",
        status: "offline"
    };

    try {
        userService.findUserByUsername({username: req.query.username}).then(data => {
            if (data !== null) {
                return res.status(201).json({
                    status: 404,
                    message: "User Already Exists"
                });
            }

            userService.createUser(newuser).then(response => {
                response = utilsService.clearPassword(response);
                return res.status(201).json({
                    message: "Successfully Created User",
                    data: response,
                    status: 201
                })
            });
        });
    } catch (e) {
        return res.status(400).json({
            status: 400,
            message: "User Creation was Unsuccessful" + e
        });
    }
};

/**
 * Path to return the information about an user, given the username;
 * The password is not returned to maintain some security tho.
 */
exports.getUserByUsername = async function (req, res, next) {
    utilsService.solveCorsProblems(res);
    let params = {
        username: req.query.username
    };

    try {
        userService.findUserByUsername(params).then(response => {
            response = utilsService.clearPassword(response);
            return res.status(201).json({
                data: response,
                status: 201
            });
        })
    } catch (e) {
        return res.status(400).json({
            status: 400,
            message: "Error" + e
        });
    }
};

/**
 * Path to return the information about an user, given the id;
 * The password is not returned to maintain some security tho.
 */
exports.getUserById = async function (req, res, next) {
    utilsService.solveCorsProblems(res);
    let params = {
        _id: req.query.id
    };

    try {
        userService.findUserById(params).then(response => {
            response = utilsService.clearPassword(response);
            return res.status(201).json({
                data: response,
                status: 201
            });
        })
    } catch (e) {
        return res.status(400).json({
            status: 400,
            message: "Error" + e
        });
    }
};

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*|JSON|Promise<any>>}
 */
exports.getAllUsers = async function (req, res, next) {
    utilsService.solveCorsProblems(res);
    try {
        userService.getAllUsers().then(data => {
            data = utilsService.clearPasswords(data);
            return res.status(201).json({
                status: 201,
                data: data
            });
        });
    } catch (e) {
        return res.status(400).json({
            message: "Error: " + e,
            status: 400
        });
    }
};

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*|JSON|Promise<any>>}
 */
exports.getUserAvatar = async function (req, res, next) {
    utilsService.solveCorsProblems(res);
    let params = {
        _id: req.query._id
    };

    try {
        userService.findUserById(params).then(response => {
            response = utilsService.clearPassword(response);
            return res.status(201).json({
                data: response.avatar,
                status: 201
            });
        })
    } catch (e) {
        return res.status(400).json({
            status: 400,
            message: "Error" + e
        });
    }
};

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*|JSON|Promise<any>>}
 */
exports.getUserFriendRequestsAwait = async function (req, res, next) {
    utilsService.solveCorsProblems(res);
    let params = {
        _id: req.query._id
    };

    try {
        userService.findUserById(params).then(response => {
            response = utilsService.clearPassword(response);
            return res.status(201).json({
                data: response.friendRequestsAwait,
                status: 201
            });
        })
    } catch (e) {
        return res.status(400).json({
            status: 400,
            message: "Error" + e
        });
    }
};

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*|JSON|Promise<any>>}
 */
exports.updateAvatar = async function (req, res, next) {
    utilsService.solveCorsProblems(res);

    try {
        userService.updateAvatar(req.body).then(data => {
            return res.status(201).json({
                status: 201,
                data: data
            });
        });
    } catch (e) {
        return res.status(400).json({
            message: "Error: " + e,
            status: 400
        });
    }
};

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*|JSON|Promise<any>>}
 */
exports.updateStatus = async function (req, res, next) {
    utilsService.solveCorsProblems(res);

    try {
        userService.updateStatus(req.query).then(data => {
            return res.status(201).json({
                status: 201,
                data: data
            });
        });
    } catch (e) {
        return res.status(400).json({
            message: "Error: " + e,
            status: 400
        });
    }
};

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*|JSON|Promise<any>>}
 */
exports.sendFriendRequest = async function (req, res, next) {
    utilsService.solveCorsProblems(res);
    try{
        userService.sendFriendRequest(req.query).then(data => {
            return res.status(201).json({
                status: 201,
                data: data
            });
        });
    } catch (e){
        return res.status(400).json({
            message: "Error: " + e,
            status: 400
        });
    }
};

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*|JSON|Promise<any>>}
 */
exports.sendRequestAnswer = async function (req, res, next) {
    utilsService.solveCorsProblems(res);
    try{
        userService.sendRequestAnswer(req.query).then(data => {
            return res.status(201).json({
                status: 201,
                data: data
            });
        });
    } catch (e){
        return res.status(400).json({
            message: "Error: " + e,
            status: 400
        });
    }
};

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
exports.createGroupConversation = async function (req, res, next) {
    utilsService.solveCorsProblems(res);
    try{
        userService.createGroupConversation(req.query).then(data => {
            return res.status(201).json({
                status: 201,
                data: data
            });
        });
    } catch (e){
        return res.status(400).json({
            message: "Error: " + e,
            status: 400
        });
    }
};