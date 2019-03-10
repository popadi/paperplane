let friendships = require('../models/friendship.model');
_this = this;

/**
 *
 * @param info
 * @returns {Promise<void>}
 */
exports.createFriendship = async function(info) {
    let friendship = new friendships({
        privateConversationID: info.privateConversationID,
        timestamp: new Date().getTime(),
        friendID: info.friendID
    });

    try {
        let savedFriendship = await friendship.save();
        console.log("[C] createFriendship");
        return savedFriendship;
    } catch (e) {
        throw Error("Error while creating Friendship");
    }
};