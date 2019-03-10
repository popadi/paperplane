let conversations = require('../services/conversation.service');
let friendships = require('../services/friendship.service');
let users = require('../models/user.model');
_this = this;

/**
 * Finds the credentials in the database and returns an object with the
 * actual response from the database or an empty object if nothing was
 * found.
 *
 * @param credentials: credentials to be checked
 * @returns {Promise<*>}: the answer to the query
 */
exports.authenticateUser = async function (credentials) {
    let answer = await users.findOne(credentials, function (err, users) {
        return users;
    });

    console.log("[C] authenticateUser");
    return answer;
};

/**
 * Creates a new user in the database with the given info.
 *
 * @param data to be used ot create the user
 * @returns {Promise<*>}: the answer
 */
exports.createUser = async function (data) {
    let user = new users({
        username: data.username,
        password: data.password,

        firstName: data.firstName,
        lastName: data.lastName,

        friends: data.friends,
        avatar: data.avatar,
        status: data.status
    });

    try {
        let savedUser = await user.save();
        console.log("[C] createUser");
        return savedUser;
    } catch (e) {
        throw Error("Error while Creating User");
    }
};

/**
 * Retrieves the profile of an user given its username.
 *
 * @param credentials: credentials to be checked
 * @returns {Promise<*>}: the answer to the query
 */
exports.findUserByUsername = async function (credentials) {
    let answer = await users.findOne(credentials, function (err, users) {
        return users;
    });

    console.log("[C] findUserByUsername");
    return answer;
};

/**
 * Retrieves the profile of an user given its id.
 *
 * @param credentials: credentials to be checked
 * @returns {Promise<*>}: the answer to the query
 */
exports.findUserById = async function (credentials) {
    let answer = await users.findOne(credentials, function (err, users) {
        return users;
    });

    console.log("[C] findUserById");
    return answer;
};

/**
 * Retrieves all the users in the database. Necessary
 * if we are on the 'search friends' page.
 *
 * @returns {Promise<*>}: the answer
 */
exports.getAllUsers = async function () {
    let answer = await users.find({}, function (err, users) {
        return users;
    });

    console.log("[C] getAllUsers");
    return answer;
};

/**
 * Searches for an user with the given username and update
 * its avatar with the one given in the parameters. It may
 * be an URL or a base64 image.
 *
 * @param params: username and the avatar
 * @returns {Promise<*>}: the answer
 */
exports.updateAvatar = async function (params) {
    let update = await users.update({
        username: params.username
    }, {
        avatar: params.avatar
    });

    console.log("[C] updateAvatar");
    return update;
};

/**
 *
 * @param params
 * @returns {Promise<void>}
 */
exports.updateStatus = async function (params) {
    let update = await users.update({
        username: params.username
    }, {
        status: params.status
    });

    console.log("[C] updateStatus");
    return update;
};

/**
 *
 * @param params
 * @returns {Promise<{sender: *, receiver: *}>}
 */
exports.sendFriendRequest = async function (params) {
    let updateSender = await users.update({
        _id: params.src
    }, {
        $push: {
            friendRequestsSent: params.dst
        }
    });

    let updateReceiver = await users.update({
        _id: params.dst
    }, {
        $push: {
            friendRequestsAwait: params.src
        }
    });

    console.log("[C] sendFriendRequest");
    return {
        sender: updateSender,
        receiver: updateReceiver
    }
};

/**
 *
 * @param params
 * @returns {Promise<{sender: *, receiver: *}>}
 */
exports.sendRequestAnswer = async function (params) {
    let updateSender = await users.update({
        _id: params.src
    }, {
        $pull: {
            friendRequestsAwait: params.dst
        }
    });

    let updateReceiver = await users.update({
        _id: params.dst
    }, {
        $pull: {
            friendRequestsSent: params.src
        }
    });

    /**
     *
     */
    if (params.answer === 'true') {
        console.log(params, params.answer);

        let sourceToDestFriendship = undefined;
        let destToSourceFriendship = undefined;
        let privateConversation = undefined;

        try {
            privateConversation = await conversations.createConversation({
                firstUser: params.src,
                secondUser: params.dst
            }).then(response => {
                return response;
            }).catch(errorHandler);

            sourceToDestFriendship = await friendships.createFriendship({
                privateConversationID: privateConversation._id,
                friendID: params.src
            }).then(response => {
                return response;
            }).catch(errorHandler);

            destToSourceFriendship = await friendships.createFriendship({
                privateConversationID: privateConversation._id,
                friendID: params.dst
            }).then(response => {
                return response;
            }).catch(errorHandler);

            updateSender = await users.update({
                _id: params.src
            }, {
                $push: {
                    friends: destToSourceFriendship
                }
            });

            updateReceiver = await users.update({
                _id: params.dst
            }, {
                $push: {
                    friends: sourceToDestFriendship
                }
            });
        } catch (e) {
            errorHandler(e);
        }
    }

    console.log("[C] sendRequestAnswer");
    return {
        receiver: updateReceiver,
        sender: updateSender
    }
};

/**
 *
 * @param params
 * @returns {Promise<{}>}
 */
exports.createGroupConversation = async function (params) {
    let groupConversation = undefined;
    let updateParticipant = undefined;

    try {
        groupConversation = await conversations.createGroupConversation({
            participants: params.participants,
            name: params.name
        }).then(response => {
            return response;
        }).catch(errorHandler);

        for (let i = 0; i < params.participants.length; ++i) {
            updateParticipant = await users.update({
                _id: params.participants[i]
            }, {
                $push: {
                    groups: groupConversation._id
                }
            });
        }
    } catch (e) {
        errorHandler(e);
    }

    console.log("[C] createGroupConversation");
    return {
        conversation: groupConversation
    }
};

function errorHandler(error) {
    console.log("[X] Error occured: " + error);
}