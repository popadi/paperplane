angular.module('app').controller('faqController', function ($scope, $rootScope, $http, $uibModalInstance, ConfigService, currentUser, socket) {

    /**
     *
     */
    $scope.init = function () {
        $scope.newAvatar = currentUser.avatar;
        $scope.currentUser = currentUser;
    };

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.init();
});