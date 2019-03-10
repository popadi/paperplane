angular.module('app').controller('logoutController', function ($scope, $location, $cookies, $rootScope, $http,
                                                               $uibModalInstance, ConfigService, UserService,
                                                               currentUser, socket) {
    $scope.ok = function () {
        UserService.changeStatus($rootScope.globals.currentUser.username, "offline").then(data => {
            $location.url(ConfigService.getServerAddress());
            $rootScope.globals.currentUser = undefined;
            $cookies.remove('globals');

            socket.emit('user-status-change-event', JSON.stringify({
                _id: currentUser._id,
                status: "offline"
            }));

            setTimeout(function () {
                socket.disconnect();
            }, 10);
        });

        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});