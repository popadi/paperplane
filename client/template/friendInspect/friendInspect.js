angular.module('app').controller('friendInspectController', function ($scope, $rootScope, $http, $uibModalInstance, ConfigService, currentUser, clickedFriend, UtilsService) {

    /**
     *
     */
    $scope.init = function () {
        $scope.clickedFriend = clickedFriend;
        $scope.currentUser = currentUser;
        console.log(clickedFriend);
    };

    $scope.friendsFor = function () {
        let tdiff = undefined;

        $scope.currentUser.friends.forEach(f => {
            if (f.friendID === $scope.clickedFriend._id) {
                tdiff = UtilsService.formatMessageDate(f.timestamp);
            }
        });

        return tdiff;
    };

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.init();
});