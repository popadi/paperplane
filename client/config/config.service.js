(function () {
    'use strict';

    angular.module('app').factory('ConfigService', ConfigService);

    function ConfigService() {
        let IP = "http://127.0.0.1:5555";
        let service = {};

        service.getServerAddress = getServerAddress;
        service.getPathTo = getPathTo;

        function getServerAddress() {
            return IP;
        }

        function getPathTo(rest) {
            return getServerAddress() + rest;
        }

        return service;
    }
})();