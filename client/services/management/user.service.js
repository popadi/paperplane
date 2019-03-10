(function () {
    'use strict';
    angular.module('app').factory('UserService', UserService);
    UserService.$inject = ['$http', 'md5', 'ConfigService'];

    function UserService($http, md5, ConfigService) {
        let service = {};
        
        service.create = function (user) {
            let fullAddress = ConfigService.getPathTo("/user/createUser");
            user.password = md5.createHash(user.password);

            return $http({
                method: "POST",
                url: fullAddress,
                params: user
            }).then(function (result) {
                console.log(result);
                if (result.data.status !== 201) {
                    return {
                        success: false,
                        message: 'Username "' + user.username + '" is already taken'
                    }
                }

                return {
                    success: true
                };
            }, function (error) {
                console.log(error);
                return {
                    success: false,
                    message: error
                };
            });
        };

        service.getByUsername = function (username) {
            let fullAddress = ConfigService.getPathTo("/user/getUserByUsername");
            return $http({
                method: "GET",
                url: fullAddress,
                params: {
                    username: username,
                }
            }).then(handleSuccess, handleError);
        };

        service.getById = function (id) {
            let fullAddress = ConfigService.getPathTo("/user/getUserById");
            return $http({
                method: "GET",
                url: fullAddress,
                params: {
                    id: id,
                }
            }).then(handleSuccess, handleError);
        };

        service.getAllUsers = function () {
            let fullAddress = ConfigService.getPathTo("/user/getAllUsers");
            return $http({
                url: fullAddress,
                method: "GET",
            }).then(handleSuccess, handleError);
        };

        service.getUserAvatar = function (_id) {
            let fullAddress = ConfigService.getPathTo("/user/getUserAvatar");
            return $http({
                method: "GET",
                url: fullAddress,
                params: {
                    _id: _id,
                }
            }).then(handleSuccess, handleError);
        };

        service.getUserFriendRequestsAwait = function (_id) {
            let fullAddress = ConfigService.getPathTo("/user/getUserFriendRequestsAwait");
            return $http({
                method: "GET",
                url: fullAddress,
                params: {
                    _id: _id,
                }
            }).then(handleSuccess, handleError);
        };

        service.changeStatus = function (username, status) {
            let fullAddress = ConfigService.getPathTo("/user/updateStatus");
            return $http({
                url: fullAddress,
                method: "POST",
                params: {
                    username: username,
                    status: status,
                }
            }).then(handleSuccess, handleError);
        };

        service.sendFriendRequest = function (params) {
            let fullAddress = ConfigService.getPathTo("/user/sendFriendRequest");
            return $http({
                url: fullAddress,
                method: "POST",
                params: params
            }).then(handleSuccess, handleError);
        };

        service.sendRequestAnswer = function (params) {
            let fullAddress = ConfigService.getPathTo("/user/sendRequestAnswer");
            return $http({
                url: fullAddress,
                method: "POST",
                params: params
            }).then(handleSuccess, handleError);
        };

        service.createGroupConversation = function (params) {
            let fullAddress = ConfigService.getPathTo("/user/createGroupConversation");
            return $http({
                url: fullAddress,
                method: "POST",
                params: params
            }).then(handleSuccess, handleError);
        };

        function handleSuccess(result) {
            console.log(result);
            return result.data;
        }

        function handleError(error) {
            return function () {
                return {
                    success: false,
                    message: error
                };
            };
        }

        return service;
    }
})();
