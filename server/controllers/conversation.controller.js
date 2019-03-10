const utilsService = require('../utils/utilsService');
const conversationService = require('../services/conversation.service');
_this = this;

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.getConversationByID = async function (req, res, next) {
    utilsService.solveCorsProblems(res);
    try {
        conversationService.getConversationByID({
            _id: req.query._id
        }).then(response => {
            return res.status(201).json({
                data: response,
                status: 201
            });
        });
    } catch (e) {
        return res.status(400).json({
            status: 400,
            message: "Error: " + e
        });
    }
};

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.addMessageToConversation = async function (req, res, next) {
    utilsService.solveCorsProblems(res);
    let params = {
        conversationID: req.query.conversationID,
        message: req.query.message
    };

    try {
        conversationService.addMessageToConversation(params).then(response => {
            return res.status(201).json({
                data: response,
                status: 201
            });
        })
    } catch (e) {
        return res.status(400).json({
            status: 400,
            message: "Error: " + e
        });
    }
};