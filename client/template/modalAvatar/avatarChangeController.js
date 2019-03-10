angular.module('app').controller('avatarChangeController', function ($scope, $rootScope, $http, $uibModalInstance, ConfigService, currentUser, socket) {
    $scope.defaultAvatars = [
        ["http://s3-us-west-1.amazonaws.com/witty-avatars/default-avatar-1-l.jpg",
            "http://s3-us-west-1.amazonaws.com/witty-avatars/default-avatar-2-l.jpg",
            "http://s3-us-west-1.amazonaws.com/witty-avatars/default-avatar-3-l.jpg"],
        ["http://s3-us-west-1.amazonaws.com/witty-avatars/default-avatar-4-l.jpg",
            "http://s3-us-west-1.amazonaws.com/witty-avatars/default-avatar-5-l.jpg",
            "http://www.lovemarks.com/wp-content/uploads/profile-avatars/default-avatar-eskimo-girl.png"],
        ["http://www.lovemarks.com/wp-content/uploads/profile-avatars/default-avatar-braindead-zombie.png",
            "http://www.lovemarks.com/wp-content/uploads/profile-avatars/default-avatar-ponsy-deer.png",
            "http://www.lovemarks.com/wp-content/uploads/profile-avatars/default-avatar-short-hair-girl.png"]
    ];

    /**
     *
     */
    $scope.init = function () {
        $scope.newAvatar = currentUser.avatar;
        $scope.currentUser = currentUser;
    };

    /**
     *
     */
    $scope.changeAvatar = function () {
        $http({
            method: "POST",
            url: ConfigService.getPathTo("/user/updateAvatar"),
            data: {
                username: $scope.currentUser.username,
                avatar: $scope.newAvatar
            }
        }).then(function (response) {
            socket.emit('avatar-change-event', JSON.stringify({
                _id: $scope.currentUser._id
            }));

            $scope.error = undefined;
            $scope.success = true;
        }, function (error) {
            $scope.success = false;
            $scope.error = error;
        });
    };

    /**
     *
     * @param link
     */
    $scope.selectNewAvatarLink = function (link) {
        $scope.newAvatar = link;
    };

    /**
     *
     * @param encoded
     */
    $scope.selectNewAvatarUpload = function (encoded) {
        $scope.newAvatar = "data:image/jpeg;base64," + encoded.base64;
    };

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.init();
});