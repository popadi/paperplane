let messages = require('../models/message.model');
_this = this;

/**
 *
 * @returns {Promise<void>}
 * @param params
 */
exports.createMessage = async function(params) {
    /* I have no idea why I need this */
    let parsed = JSON.parse(params.message);

    let message = new messages({
        timestamp: parsed.timestamp,
        content: parsed.content,
        sender: parsed.sender,
        type: parsed.type
    });

    try {
        let savedMessage = await message.save();
        console.log("[C] createMessage");
        return savedMessage;
    } catch (e) {
        throw Error("Error while creating message");
    }
};