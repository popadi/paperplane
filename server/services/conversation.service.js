let conversations = require('../models/conversation.model');
let messages = require('../services/message.service');
_this = this;

/**
 *
 * @param params
 * @returns {Promise<*>}
 */
exports.createConversation = async function (params) {
    let conversation = new conversations({
        participants: [params.firstUser, params.secondUser],
        groupConversation: false,
        content: [],
        name: ""
    });

    try {
        let savedConversation = await conversation.save();
        console.log("[C] createConversation");
        return savedConversation;
    } catch (e) {
        throw Error("Error while Creating Conversation");
    }
};

/**
 *
 * @param params
 * @returns {Promise<*>}
 */
exports.createGroupConversation = async function (params) {
    let conversation = new conversations({
        participants: params.participants,
        groupConversation: true,
        name: params.name,
        content: []
    });

    try {
        let savedConversation = await conversation.save();
        console.log("[C] createGroupConversation");
        return savedConversation;
    } catch (e) {
        throw Error("Error while createGroupConversation");
    }
};

/**
 *
 * @param params
 * @returns {Promise<void>}
 */
exports.getConversationByID = async function (params) {
    let answer = await conversations.findOne(params, function (err, conversation) {
        return conversation;
    });

    console.log("[C] getConversationByID");
    return answer;
};

/**
 *
 * @returns {Promise<void>}
 * @param params
 */
exports.addMessageToConversation = async function (params) {
    let messageToAdd = undefined;
    let answer = undefined;

    try {
        messageToAdd = await messages.createMessage(params).then(response => {
            return response;
        });

        answer = await conversations.update({
            _id: params.conversationID
        }, {
            $push: {
                content: messageToAdd
            }
        });

    } catch (e) {
        throw Error("Error: " + e);
    }

    console.log("[C] addMessageToConversation");
    return answer;
};