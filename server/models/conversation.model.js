"use strict";
const mongoosePaginate = require('mongoose-paginate');
const mongoose = require('mongoose');

let chatConversationSchema = new mongoose.Schema({
    groupConversation: Boolean,
    participants: Array,
    content: Array,
    name: String
});

chatConversationSchema.plugin(mongoosePaginate);
const chatConversation = mongoose.model('chatConversation', chatConversationSchema);
module.exports = chatConversation;