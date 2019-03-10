angular.module('app').controller('findFriendsController', function ($scope, $rootScope, $http, $uibModalInstance, ConfigService, UserService, currentUser, socket) {
    $scope.currentUser = currentUser;
    $scope.friendRequests = [];

    $scope.init = function () {
        $scope.getAllUsers();
    };

    /**
     *
     */
    $scope.getAllUsers = function () {
        UserService.getAllUsers().then(data => {
            $scope.friendRequests = [];
            let chunk_size = 5;

            /* Sort the data */
            data.data.sort(function (a, b) {
                return a._id - b._id;
            });

            /* Update current user */
            data.data.forEach(user => {
                if (user._id === $scope.currentUser._id) {
                    $scope.currentUser = user;
                }
            });

            data.data.forEach(user => {
                if ($scope.currentUser.friendRequestsAwait.indexOf(user._id) > -1) {
                    $scope.friendRequests.push(user);
                }
            });

            /* Make into chunks */
            $scope.friendRequests = getChunks($scope.friendRequests, chunk_size);
            $scope.allUsersChunks = getChunks(data.data, chunk_size);

            /* Apply the changes */
            setTimeout(function () {
                $scope.$apply();
            }, 0);
        });
    };

    /**
     *
     * @param data
     * @param chunk_size
     * @returns {Uint8Array}
     */
    function getChunks(data, chunk_size) {
        return data.map(function (e, i) {
            return i % chunk_size === 0 ? data.slice(i, i + chunk_size) : null;
        }).filter(function (e) {
            return e;
        });
    }

    /**
     *
     * @param dst
     */
    $scope.sendFriendRequest = function (dst) {
        if (dst === $scope.currentUser._id) {
            return;
        }

        UserService.sendFriendRequest({
            src: $scope.currentUser._id,
            dst: dst
        }).then(data => {
            socket.emit('friend-request-event', JSON.stringify({
                src: $scope.currentUser._id,
                dst: dst
            }));

            $scope.getAllUsers();
        })
    };

    /**
     *
     * @param dst
     * @param answer
     */
    $scope.sendRequestAnswer = function (dst, answer) {
        UserService.sendRequestAnswer({
            src: $scope.currentUser._id,
            answer: answer,
            dst: dst
        }).then(data => {
            $scope.getAllUsers();
            if (answer) {
                socket.emit('friend-request-accept-event', JSON.stringify({
                    dst: dst
                }));
            }
        })
    };

    /**
     *
     * @param otherID
     * @returns {boolean}
     */
    $scope.alreadyFriendsWith = function (otherID) {
        let weAreFriends = false;
        $scope.currentUser.friends.forEach(friendship => {
            if (friendship.friendID === otherID) {
                weAreFriends = true;
            }
        });

        return weAreFriends;
    };

    /**
     *
     */
    $scope.ok = function () {
        $uibModalInstance.close();
    };

    /**
     *
     */
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.init();
});