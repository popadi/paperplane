(function () {
    'use strict';
    angular.module('app').factory('ConversationService', ConversationService);
    ConversationService.$inject = ['$http', 'md5', 'ConfigService'];

    function ConversationService($http, md5, ConfigService) {
        let service = {};

        service.getConversationByID = function (id) {
            let fullAddress = ConfigService.getPathTo("/conversation/getConversationByID");
            return $http({
                method: "GET",
                url: fullAddress,
                params: {
                    _id: id,
                }
            }).then(handleSuccess, handleError);
        };

        service.addMessageToConversation = function (params) {
            let fullAddress = ConfigService.getPathTo("/conversation/addMessageToConversation");
            return $http({
                method: "POST",
                url: fullAddress,
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
