"use strict";
const mongoosePaginate = require('mongoose-paginate');
const mongoose = require('mongoose');

let messageSchema = new mongoose.Schema({
    timestamp: Number,
    content: String,
    sender: String,
    type: Number
});

messageSchema.plugin(mongoosePaginate);
const chatMessage = mongoose.model('chatMessage', messageSchema);
module.exports = chatMessage;