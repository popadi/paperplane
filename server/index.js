"use strict";
const userService = require('./services/user.service');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bluebird = require('bluebird');
const cors = require('cors');

mongoose.Promise = bluebird;
mongoose.connect('mongodb://127.0.0.1:27017/chat', {}).then(() => {
    console.log(`Succesfully Connected to the Mongodb Database!`);
}).catch(() => {
    console.log(`Error Connecting to the Mongodb Database!`);
});

const app = require('express')();
const server = app.listen(5555, () => {
    console.log('Listening on port 5555!');
});
const io = require('socket.io').listen(server);

app.options('*', cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const index = require('./routes/index.route');
const user = require('./routes/user.route');
const conversation = require('./routes/conversation.route');

app.use("/", index);
app.use('/user', user);
app.use('/conversation', conversation);

let activeUsers = {};
let activeConns = {};

io.on('connection', function (socket) {
    let userName = undefined;
    let userID = undefined;

    if (!activeConns.hasOwnProperty(socket.id)) {
        let handshakeData = socket.request;
        userName = handshakeData._query['username'];
        userID = handshakeData._query['_id'];

        activeUsers[userID] = socket.id;
        activeConns[socket.id] = userID;
    }

    console.log('[*] ' + userName + " (" + userID + ") just connected!");

    socket.on('new-message-event', function (content) {
        const parsedContent = JSON.parse(content);
        parsedContent.participants.forEach(userID => {
            if (activeUsers.hasOwnProperty(userID)) {
                io.sockets.connected[activeUsers[userID]]
                    .emit('new-message-event', content);
            }
        });

        console.log(socket.id, content);
    });

    /**
     * When the server receives a avatar-change-event, it sends
     * back the signal to all the friends of the sender (we do
     * not want to flood the network with useless notifications)
     *
     * Only the online friends of the user who changed the avatar
     * will be notified. The others will automatically receive the
     * correct data on the next login.
     */
    socket.on('avatar-change-event', function (content) {
        try {
            const parsedContent = JSON.parse(content);
            userService.findUserById({
                _id: parsedContent._id
            }).then(response => {
                /* Send the event to myself */
                io.sockets.connected[activeUsers[parsedContent._id]]
                    .emit('avatar-change-event', content);

                /* Send the event to my online friends */
                if (response !== null) {
                    response.friends.forEach(friendship => {
                        if (activeUsers.hasOwnProperty(friendship.friendID)) {
                            io.sockets.connected[activeUsers[friendship.friendID]]
                                .emit('avatar-change-event', content);
                        }
                    });
                }
            }).catch(error => {
                console.log("avatar-change-event: " + error);
            })
        } catch (e) {
            console.log("T/C error on avatar-change-event");
        }
    });

    /**
     * Behaves as the avatar-change-event, but for the status of an
     * user. Only the friends of the user are going to be notified
     * by the change in real time.
     */
    socket.on('user-status-change-event', function (content) {
        try {
            const parsedContent = JSON.parse(content);
            userService.findUserById({
                _id: parsedContent._id
            }).then(response => {
                /* Send the event to myself */
                io.sockets.connected[activeUsers[parsedContent._id]]
                    .emit('user-status-change-event', content);

                /* Send the event to my online friends */
                if (response !== null) {
                    response.friends.forEach(friendship => {
                        if (activeUsers.hasOwnProperty(friendship.friendID)) {
                            io.sockets.connected[activeUsers[friendship.friendID]]
                                .emit('user-status-change-event', content);
                        }
                    });
                }
            }).catch(error => {
                console.log("user-status-change-event: " + error);
            })
        } catch (e) {
            console.log("T/C error on user-status-change-event");
        }
    });

    /**
     *
     */
    socket.on('friend-request-event', function (content) {
        const parsedContent = JSON.parse(content);
        const destinationID = parsedContent.dst;

        if (activeUsers.hasOwnProperty(destinationID)) {
            io.sockets.connected[activeUsers[destinationID]]
                .emit('friend-request-event', content);
        }
    });

    /**
     *
     */
    socket.on('friend-request-accept-event', function (content) {
        const parsedContent = JSON.parse(content);
        const destinationID = parsedContent.dst;

        if (activeUsers.hasOwnProperty(destinationID)) {
            io.sockets.connected[activeUsers[destinationID]]
                .emit('friend-request-accept-event', content);
        }
    });

    socket.on('disconnect', function () {
        console.log('[*] ' + activeConns[socket.id] + ' just disconnected!');
        delete activeUsers[activeConns[socket.id]];
        delete activeConns[socket.id];
    });
});
