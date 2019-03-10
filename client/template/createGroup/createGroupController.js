angular.module('app').controller('createGroupController', function ($scope, $rootScope, $http, $uibModalInstance, ConfigService, currentUser, currentParticipants, UserService, currentUserFriends) {

    /**
     *
     */
    $scope.init = function () {
        $scope.currentUserFriends = getChunks(currentUserFriends, 5);
        $scope.currentUser = currentUser;

        $scope.selectedGroupIDS = currentParticipants;
        $scope.groupConversation = {};
        $scope.groupConversation.name = "";
    };

    $scope.selectUser = function (id) {
        $scope.selectedGroupIDS.push(id);
    };

    $scope.unselectUser = function (id) {
        let index = $scope.selectedGroupIDS.indexOf(id);
        if (index > -1) {
           $scope.selectedGroupIDS.splice(index, 1);
        }
    };

    $scope.createGroupConversation = function() {
        if ($scope.groupConversation.name === "")
            $scope.groupConversation.name = "Unnamed Group Conversation";

        UserService.createGroupConversation({
            participants:  $scope.selectedGroupIDS,
            name: $scope.groupConversation.name
        }).then(data => {
            console.log("data => ", data);
        });
    };

    function getChunks(data, chunk_size) {
        return data.map(function (e, i) {
            return i % chunk_size === 0 ? data.slice(i, i + chunk_size) : null;
        }).filter(function (e) {
            return e;
        });
    }

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.init();
});