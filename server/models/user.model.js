"use strict";
const mongoosePaginate = require('mongoose-paginate');
const mongoose = require('mongoose');

let chatUserSchema = new mongoose.Schema({
    username: String,
    password: String,
    
    firstName: String,
    lastName: String,
    
    avatar: String,
    friends: Array,
    status: String,
    groups: Array,

    friendRequestsSent: Array,
    friendRequestsAwait: Array
});

chatUserSchema.plugin(mongoosePaginate);
const chatUser = mongoose.model('chatUser', chatUserSchema);
module.exports = chatUser;