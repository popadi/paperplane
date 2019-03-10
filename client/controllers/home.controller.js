angular.module('app').controller('chatController', function ($scope, $sce, $route, $rootScope, $http, $uibModal, $q, UserService, ConfigService, EmoticonsService, ConversationService, UtilsService, RegexerService) {

    /**
     * Connects to the socket service on the server; the connection
     * is created by also sending the username of the current user
     * The connection will be used for all the real time events that
     * will occur during the use of the application.s
     */
    let socket = io.connect(ConfigService.getServerAddress(), {
        query: {
            username: $rootScope.globals.currentUser.username,
            _id: $rootScope.globals.currentUser._id
        }
    });

    /**
     *
     */
    $scope.initController = function () {
        initServices();
        resetContainers();

        $scope.activeConversationID = undefined;
        $scope.activeConversation = undefined;
        $scope.currentUser = null;

        UserService.changeStatus($rootScope.globals.currentUser.username, "online").then(data => {
            console.log("[Socket] Emmiting user-status-change-event\n");
            socket.emit('user-status-change-event', JSON.stringify({
                _id: $rootScope.globals.currentUser._id,
                status: "online"
            }));
        });

        $scope.conversation = [];
        $scope.nextMessage = "";
    };

    /**
     * Initializes some services that also must be used in the front end.
     */
    function initServices() {
        $scope.emoticonService = EmoticonsService;
    }

    /**
     * Resets the main containers used by the chat application page.
     */
    function resetContainers() {
        $scope.currentUserPrivateConversations = [];
        $scope.currentUserGroupConversations = [];
        $scope.currentContextUsernames = {};
        $scope.currentContextAvatars = {};
        $scope.currentUserFriends = [];
        $scope.offlineFriends = [];
        $scope.onlineFriends = [];
    }

    /**
     * Loads the information about the current user from the database.
     * Useful if we need the entire object to define the profile and
     * the list of available friends for chat.
     */
    $scope.loadCurrentUser = function () {
        resetContainers();
        UserService.getByUsername($rootScope.globals.currentUser.username)
            .then(function (data) {
                $scope.currentUser = data.data;
                $scope.loadCurrentUserFriends();
            });
    };

    /**
     * Loads the current user friends and populates the appropriate containers
     * with info taken from them. For each user, we save its avatar (in a dict,
     * (id, avatar) pairs), some (id, username) pairs and we also classify the
     * users into online/offline users.
     * If an user changes its avatar or status (or any other information), they
     * will be modified in the appropriate containers by another specialized
     * functions.
     */
    $scope.loadCurrentUserFriends = function () {
        console.log("%c[C] loadCurrentUserFriends", 'background: #00FF00;');
        let offlineFriendsTemp = new Set();
        let onlineFriendsTemp = new Set();
        let justFriends = new Set();
        let itemsProcessed = 0;

        /* Adding the info about the current user */
        $scope.currentContextUsernames[$scope.currentUser._id] = $scope.currentUser.username;
        $scope.currentContextAvatars[$scope.currentUser._id] = $scope.currentUser.avatar;

        $scope.currentUser.friends.forEach((f, i, v) => {
            UserService.getById(f.friendID).then(data => {
                $scope.currentContextUsernames[data.data._id] = data.data.username;
                $scope.currentContextAvatars[data.data._id] = data.data.avatar;
                justFriends.add(data.data);

                (data.data.status === 'online') ?
                    onlineFriendsTemp.add(data.data) :
                    offlineFriendsTemp.add(data.data);
            }).then(data => {
                ++itemsProcessed;
                if (itemsProcessed === v.length) {
                    $scope.offlineFriends = Array.from(offlineFriendsTemp);
                    $scope.onlineFriends = Array.from(onlineFriendsTemp);
                    $scope.currentUserFriends = Array.from(justFriends);

                    $scope.loadCurrentUserPrivateConversations();
                    $scope.loadCurrentUserGroupConversations();
                }
            });
        });

        console.log("%c[E] loadCurrentUserFriends", 'background: #FFAA00;');
    };

    /**
     * Loads all the private conversations of an user. Each conversation is augmented
     * with some specific information based on the current opened session. They are
     * also sorted by the timestamps of their last message.
     */
    $scope.loadCurrentUserPrivateConversations = function () {
        let currentUserPrivateConversationsTemp = new Set();
        let itemsProcessed = 0;

        $scope.currentUser.friends.forEach((f, i, v) => {
            ConversationService.getConversationByID(f.privateConversationID).then(data => {
                augmentConversation(data.data);
                updateConversationWithNewMessage(data.data);
                currentUserPrivateConversationsTemp.add(data.data);

                ++itemsProcessed;
                if (itemsProcessed === v.length) {
                    $scope.currentUserPrivateConversations =
                        Array.from(currentUserPrivateConversationsTemp);
                    $scope.currentUserPrivateConversations.sort((a, b) => {
                        return (b.lastMessageTimestamp - a.lastMessageTimestamp);
                    })
                }
            });
        });
    };

    /**
     *
     */
    $scope.loadCurrentUserGroupConversations = function () {
        let currentUserGroupConversationsTemp = new Set();
        let itemsProcessed = 0;

        $scope.currentUser.groups.forEach((g, i, v) => {
            ConversationService.getConversationByID(g).then(data => {
                augumentGroupConversation(data.data);
                updateConversationWithNewMessage(data.data);
                currentUserGroupConversationsTemp.add(data.data);

                ++itemsProcessed;
                if (itemsProcessed === v.length) {
                    $scope.currentUserGroupConversations =
                        Array.from(currentUserGroupConversationsTemp);
                    $scope.currentUserGroupConversations.sort((a, b) => {
                        return (b.lastMessageTimestamp - a.lastMessageTimestamp);
                    })
                }
            });
        });
    };

    /**
     *
     * @param id
     */
    $scope.isOffline = function (id) {
        let isOffline = true;
        $scope.offlineFriends.forEach(f => {
            if (f._id === id) {
                isOffline = isOffline && (f.status !== "offline");
            }
        });

        return !isOffline;
    };

    /**
     *
     * @returns {number}
     */
    $scope.mediaMessagesCount = function () {
        if ($scope.activeConversation) {
            let count = 0;
            $scope.activeConversation.content.forEach(m => {
                if (m.type === 1 || m.type === 2) {
                    ++count;
                }
            });
            return count;
        }

        return 0;
    };

    /**
     * Select and marks the active conversation from all the conversations
     * in the left. Its messages will be loaded in the conversation spot
     * and the global activeConversationID will also be changed.
     *
     * @param _id: the id of the current active conversation
     */
    $scope.selectConversation = function (_id) {
        $scope.activeConversationID = _id;
        let conversationFound = false;

        $scope.currentUserPrivateConversations.forEach(conversation => {
            if (conversation._id === $scope.activeConversationID) {
                conversation.unreadMessages = 0;
                conversationFound = true;
                $scope.activeConversation = conversation;
            }
        });

        if (!conversationFound) {
            $scope.currentUserGroupConversations.forEach(conversation => {
                if (conversation._id === $scope.activeConversationID) {
                    conversation.unreadMessages = 0;
                    conversationFound = true;
                    $scope.activeConversation = conversation;
                }
            });
        }
    };

    /**
     *
     * @param _uid
     */
    $scope.selectConversationFromUser = function (_uid) {
        console.log(_uid);

        $scope.currentUserPrivateConversations.forEach(conv => {
            if (conv.otherParticipantID === _uid) {
                conv.unreadMessages = 0;
                $scope.activeConversation = conv;
            }
        })
    };

    /**
     * Adds an emoticon to the current message in the message box. The
     * function is needed because there are unicode filters applied to
     * the message.
     *
     * @param emoticon: unicode value to be added to the text
     */
    $scope.addEmoticon = function (emoticon) {
        $scope.activeConversation.nextMessage += emoticon;
        applyChanges();
    };

    /**
     * Replace an emoticon in the text with the actual unicode form of it.
     * The feature mimics the behaviour of facebook, when we use :), :D,
     * (y), <3 etc.
     */
    $scope.replaceEmoticon = function () {
        Object.keys(EmoticonsService.keyboardEmoticons).forEach(key => {
            if ($scope.activeConversation.nextMessage.indexOf(key) > -1) {
                $scope.activeConversation.nextMessage =
                    $scope.activeConversation.nextMessage
                        .replace(key, EmoticonsService.keyboardEmoticons[key]);
                applyChanges();
            }
        });
    };


    /**
     * Send the message from the currentActiveConversation. Sending a message
     * means two thins:
     * [1] Save the message in the database in the appropriate conversation
     * [2] Emit a socket event to notify the other user/s about the new message
     * When the event returns, the message is added to the conversation locally.
     * This is done to prevent the loading of the entire conversation. If the
     * page is refreshed or we just logged in, the conversation is loaded
     * entirely correctly.
     */
    $scope.sendMessage = function () {
        let youtubeLink = RegexerService.checkForYoutubeLink($scope.activeConversation.nextMessage);
        let imageLink = RegexerService.checkForImageLink($scope.activeConversation.nextMessage);
        let basicLink = RegexerService.checkForBasicURL($scope.activeConversation.nextMessage);
        let messageType = 0;

        if (youtubeLink !== "") {
            messageType = 1;
        } else if (imageLink !== "") {
            messageType = 2;
        } else if (basicLink !== "") {
            messageType = 3;
        }

        let messageToSend = {
            content: $scope.activeConversation.nextMessage,
            sender: $scope.currentUser._id,
            timestamp: new Date().getTime(),
            type: messageType
        };

        ConversationService.addMessageToConversation({
            conversationID: $scope.activeConversationID,
            message: messageToSend
        }).then(response => {
            socket.emit('new-message-event', JSON.stringify({
                participants: $scope.activeConversation.participants,
                conversationID: $scope.activeConversationID,
                message: messageToSend
            }));
            $scope.activeConversation.nextMessage = "";
        });
    };

    /**
     *
     */
    $scope.sendLikeMessage = function () {
        let messageToSend = {
            sender: $scope.currentUser._id,
            timestamp: new Date().getTime(),
            content: "",
            type: 4
        };

        ConversationService.addMessageToConversation({
            conversationID: $scope.activeConversationID,
            message: messageToSend
        }).then(response => {
            socket.emit('new-message-event', JSON.stringify({
                participants: $scope.activeConversation.participants,
                conversationID: $scope.activeConversationID,
                message: messageToSend
            }));
            $scope.activeConversation.nextMessage = "";
        });
    };

    /**
     * After a conversation is received, we must augment it with several info
     * that are not available in the database, and they strictly depend on the
     * logged in user or the actual context.
     * These information include the nextMessage, the other participant, the
     * avatar of the other participant etc.
     *
     * @param conversation: the conversation to add info to
     */
    function augmentConversation(conversation) {
        let fstID = conversation.participants[0];
        let sndID = conversation.participants[1];
        let otherParticipantID = (fstID === $scope.currentUser._id) ? sndID : fstID;

        conversation.name = undefined;
        conversation.nextMessage = "";
        conversation.avatar = undefined;

        conversation.otherParticipantID = otherParticipantID;
        conversation.name = $scope.currentContextUsernames[otherParticipantID];
        conversation.avatar = $scope.currentContextAvatars[otherParticipantID];
    }
    /**
     * After a conversation is received, we must augment it with several info
     * that are not available in the database, and they strictly depend on the
     * logged in user or the actual context.
     * These information include the nextMessage, the other participant, the
     * avatar of the other participant etc.
     *
     * @param conversation: the group conversation to add info to
     */
    function augumentGroupConversation(conversation) {
        conversation.nextMessage = "";
    }

    /**
     * After receiving a new message in the conversation, we need to update some
     * properties, as the lastMessageTimestamp, lastMessageDate and lastMessage
     * actual content. These changes will be reflected in the left side (the
     * conversations location). If the lastMessage content is too long, it will
     * be trimmed to 30 characters.
     *
     * @param conversation: conversation to be updated.
     */
    function updateConversationWithNewMessage(conversation) {
        let contentLength = conversation.content.length;
        let lastMessageObj = (contentLength > 0) ?
            conversation.content[contentLength - 1] :
            undefined;

        conversation.lastMessageTimestamp = (contentLength > 0) ?
            lastMessageObj.timestamp :
            undefined;

        conversation.lastMessageDate = (contentLength > 0) ?
            UtilsService.formatMessageDate(lastMessageObj.timestamp) :
            undefined;

        conversation.lastMessage = (contentLength > 0) ?
            ((lastMessageObj.content.length > 20) ?
                lastMessageObj.content.substring(0, 20) + "..." :
                lastMessageObj.content) :
            undefined;

        conversation.avatar =
            $scope.currentContextAvatars[conversation.otherParticipantID];
    }

    /**
     * When an user changes its status (online -> offline, offline -> online
     * or other combinations), we must also update it in the right side of the
     * application (the friends list). This is done by the moveUser function
     * that takes an user from an array and moves it completely to the second
     * one, not before changing the user status to the given one.
     *
     * @param params: dictionary containing the user id and the new status
     */
    function updateFriendNewStatus(params) {
        /**
         * Moves an user from an array to another one, not before changing the
         * status of the user with the specific ID.
         *
         * @param userID: the user id of the user to be moved
         * @param firstArray: the first array to be used
         * @param secondArray: the second array to be used
         */
        function moveUser(userID, firstArray, secondArray) {
            let userIndex = undefined;
            firstArray.forEach((u, i) => {
                if (u._id === userID) {
                    u.status = params.status;
                    userIndex = i;
                }
            });

            if (userIndex > -1) {
                secondArray.push(firstArray[userIndex]);
                firstArray.splice(userIndex, 1);
            }
        }

        if (params.status === "offline") {
            moveUser(params._id, $scope.onlineFriends, $scope.offlineFriends);
        } else if (params.status === "online") {
            moveUser(params._id, $scope.offlineFriends, $scope.onlineFriends);
        }

        applyChanges();
    }

    /*********************************************************************************************
     *                                      Search functions
     *
     ********************************************************************************************/
    $scope.whatToSearchInConversation = {};
    $scope.whatToSearchInConversation.text = "";
    $scope.searchInConversationActive = false;
    $scope.searchResultsActive = false;
    $scope.searchResultIndex = 1;
    $scope.highlightedMessages = [];
    $scope.triggerSearchInConversation = function () {
        $scope.searchInConversationActive = !$scope.searchInConversationActive;
        $scope.searchResultsActive = false;

        $scope.highlightedMessages.forEach(m => {
            m.removeClass("message-content-searched");
        });
    };

    $scope.searchInConversation = function () {
        if ($scope.searchInConversationActive) {
            $scope.highlightedMessages.forEach(m => {
                m.removeClass("message-content-searched");
            });

            $scope.highlightedMessages = [];
            console.log($scope.whatToSearchInConversation);

            $scope.activeConversation.content.forEach(m => {
                if (m.type === 0 && $scope.whatToSearchInConversation.text.length >= 2) {
                    if (m.content.indexOf($scope.whatToSearchInConversation.text) > -1) {
                        let convMessageHTMLObject = $("#" + m._id).parent();
                        convMessageHTMLObject.addClass("message-content-searched");
                        $scope.highlightedMessages.push(convMessageHTMLObject);
                    }
                }
            })
        }

        if ($scope.highlightedMessages.length > 0) {
            $scope.searchResultsActive = true;
            $scope.searchResultIndex = $scope.highlightedMessages.length - 1;
            $scope.scrollToHighlightedMessage();
        }
    };

    /**
     *
     */
    $scope.scrollToHighlightedMessage = function () {
        $("#messages-container").animate({
            scrollTop: $scope.highlightedMessages[$scope.searchResultIndex].offset().top - 100
        }, 500);
    };

    $scope.increaseSearchIndex = function () {
        let newIndex = Math.max($scope.searchResultIndex - 1, 0);
        if ($scope.searchResultIndex !== newIndex) {
            $scope.searchResultIndex = newIndex;
            $scope.scrollToHighlightedMessage();
            console.log($scope.searchResultIndex);
        }
    };

    $scope.decreaseSearchIndex = function () {
        $scope.searchResultIndex = Math.min(
            $scope.searchResultIndex + 1,
            $scope.highlightedMessages.length - 1);
        $scope.scrollToHighlightedMessage();
        console.log($scope.searchResultIndex);
    };

    $scope.closeViewResults = function () {
        $scope.searchResultsActive = false;
    };

    /*********************************************************************************************
     *                                          Sockets
     *                               (to be moved in separate service)
     ********************************************************************************************/

    /**
     * When a new message is received, we add it into the internal array
     * of the conversations in the front-end. It works even if the dest
     * conversation is not the active one. The conversations will be sorted
     * again by the timestamps (the conversation where this message was
     * received will move to the head of the list).
     */
    socket.on('new-message-event', function (response) {
        const parsedResponse = JSON.parse(response);
        //TODO: AVOID DUPLICATING CODE

        $scope.currentUserPrivateConversations.forEach(conversation => {
            if (conversation._id === parsedResponse.conversationID) {
                conversation.content.push(parsedResponse.message);
                updateConversationWithNewMessage(conversation);

                if (conversation._id !== $scope.activeConversationID) {
                    if (!conversation.hasOwnProperty("unreadMessages")) {
                        conversation.unreadMessages = 1;
                    } else {
                        conversation.unreadMessages += 1;
                    }
                }

                $scope.currentUserPrivateConversations.sort((a, b) => {
                    return (b.lastMessageTimestamp - a.lastMessageTimestamp);
                })
            }
        });

        $scope.currentUserGroupConversations.forEach(conversation => {
            if (conversation._id === parsedResponse.conversationID) {
                conversation.content.push(parsedResponse.message);
                updateConversationWithNewMessage(conversation);

                if (conversation._id !== $scope.activeConversationID) {
                    if (!conversation.hasOwnProperty("unreadMessages")) {
                        conversation.unreadMessages = 1;
                    } else {
                        conversation.unreadMessages += 1;
                    }
                }

                $scope.currentUserGroupConversations.sort((a, b) => {
                    return (b.lastMessageTimestamp - a.lastMessageTimestamp);
                })
            }
        });

        $scope.playAudio('resources/audio/notif.mp3');
        applyChanges();
    });

    /**
     * On a received avatar-change-event, we load again the current
     * user info, only if we sent the original event; this will make
     * the avatar of our offline/online friends to be updated on the
     * right side of the window. We do not have to load all the users,
     * since for the 'find friends' modal, we have a separate load
     * function.
     *
     * If the user that changed the avatar is not the current user, we
     * only get the info about him from the database and change it in
     * the global friends array.
     */
    socket.on('avatar-change-event', function (response) {
        let content = JSON.parse(response);
        UserService.getById(content._id).then(data => {
            if (content._id === $scope.currentUser._id) {
                $scope.currentUser.avatar = data.data.avatar;
            } else {
                $scope.currentUserFriends.forEach((friend, index) => {
                    if (data.data._id === friend._id) {
                        $scope.currentUserFriends[index].avatar = data.data.avatar;
                        $scope.currentContextAvatars[data.data._id] = data.data.avatar;
                    }
                });

                $scope.currentUserPrivateConversations.forEach(c => {
                    if (c.otherParticipantID === content._id) {
                        c.avatar = $scope.currentContextAvatars[content._id];
                    }
                });
            }

            applyChanges();
        });
    });

    /**
     * Respond to a socket event of type user-status-change. This
     * event is emmited when a user is logging in/out or its the
     * status is manually changed (to busy/away). We change the
     * status of that specific user in the currentUserFriends list
     * and in the same time, we count them again and put them in
     * their specific containers.
     */
    socket.on('user-status-change-event', function (response) {
        const parsedResponse = JSON.parse(response);
        if ($rootScope.globals.currentUser) {
            if (parsedResponse._id === $rootScope.globals.currentUser._id) {
                $scope.loadCurrentUser();
            } else {
                updateFriendNewStatus(parsedResponse);
            }
        }
    });

    /**
     * Receives a friend request signal. If the user is online, this
     * will trigger to load the current user's information again and
     * play a notification sound.
     * The reload of the current global user is necessary to get the
     * amount of received friend requests and to display them in the
     * right upper corner.
     */
    socket.on('friend-request-event', function () {
        $scope.playAudio('resources/audio/frd_req.mp3');
        UserService.getUserFriendRequestsAwait($scope.currentUser._id).then(data => {
            $scope.currentUser.friendRequestsAwait = data.data;
            applyChanges();
        })
    });

    /**
     * When we receive a friend request accept event, it means we have a
     * new friend and a new (empty) conversation, so we actually have to
     * reload the user.
     */
    socket.on('friend-request-accept-event', function () {
        $scope.loadCurrentUser();
    });

    /**
     * Receives a path to an audio file and plays it. If multiple calls
     * to this function are received, the sounds will overlap.
     *
     * @param path: path to the desired sound to be played
     */
    $scope.playAudio = function (path) {
        let audio = new Audio(path);
        audio.play();
    };

    function applyChanges() {
        setTimeout(function () {
            $scope.$apply();
        }, 0);
    }

    /*********************************************************************************************
     *                                          Modals
     *                               (to be moved in separate service)
     *********************************************************************************************/

    $scope.changeAvatarModal = function () {
        let modalInstance = $uibModal.open({
            templateUrl: 'template/modalAvatar/avatarChangeTemplate.html',
            controller: 'avatarChangeController',
            ariaLabelledBy: 'modalAvatar-title',
            ariaDescribedBy: 'modalAvatar-body',
            resolve: {
                currentUser: function () {
                    return $scope.currentUser;
                }, socket: function () {
                    return socket;
                }
            }
        });

        modalInstance.result.then(function () {
        }, function () {
        });
    };

    $scope.logoutModal = function () {
        let modalInstance = $uibModal.open({
            templateUrl: 'template/modalLogout/logoutTemplate.html',
            controller: 'logoutController',
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            resolve: {
                currentUser: function () {
                    return $scope.currentUser;
                }, socket: function () {
                    return socket;
                }
            }
        });

        modalInstance.result.then(function () {
        }, function () {
        });
    };

    $scope.findFriendsModal = function () {
        let modalInstance = $uibModal.open({
            templateUrl: 'template/modalFindFriends/findFriendsTemplate.html',
            controller: 'findFriendsController',
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            size: 'lg',
            resolve: {
                currentUser: function () {
                    return $scope.currentUser;
                }, socket: function () {
                    return socket;
                }
            }
        });

        modalInstance.result.then(function () {
            $scope.loadCurrentUser();
        }, function () {
            $scope.loadCurrentUser();
        });
    };

    $scope.friendInspectModal = function (clickedFriend) {
        let modalInstance = $uibModal.open({
            templateUrl: 'template/friendInspect/friendInspect.html',
            controller: 'friendInspectController',
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            size: 'md',
            resolve: {
                currentUser: function () {
                    return $scope.currentUser;
                }, clickedFriend: function () {
                    return clickedFriend;
                }
            }
        });

        modalInstance.result.then(function () {
        }, function () {
        });
    };

    $scope.createGroupModal = function (currentParticipants) {
        let modalInstance = $uibModal.open({
            templateUrl: 'template/createGroup/createGroupTemplate.html',
            controller: 'createGroupController',
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            size: 'lg',
            resolve: {
                currentUser: function () {
                    return $scope.currentUser;
                }, currentParticipants: function () {
                    return currentParticipants;
                }, currentUserFriends: function () {
                    return $scope.currentUserFriends;
                }
            }
        });

        modalInstance.result.then(function () {
            $scope.loadCurrentUser();
        }, function () {
            $scope.loadCurrentUser();
        });
    };

    $scope.faqModal = function () {
        let modalInstance = $uibModal.open({
            templateUrl: 'template/faq/faqTemplate.html',
            controller: 'faqController',
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            size: 'lg',
            resolve: {
                currentUser: function () {
                    return $scope.currentUser;
                }, socket: function () {
                    return socket;
                }
            }
        });

        modalInstance.result.then(function () {
            $scope.loadCurrentUser();
        }, function () {
            $scope.loadCurrentUser();
        });
    };

    $scope.initController();
});