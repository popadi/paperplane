"use strict";
const mongoosePaginate = require('mongoose-paginate');
const mongoose = require('mongoose');

let friendshipSchema = new mongoose.Schema({
    privateConversationID: String,
    timestamp: Number,
    friendID: String
});

friendshipSchema.plugin(mongoosePaginate);
const friendship = mongoose.model('friendship', friendshipSchema);
module.exports = friendship;