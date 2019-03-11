(function () {
    'use strict';

    angular.module('app').factory('ConfigService', ConfigService);

    function ConfigService() {
        let IP = "http://142.93.84.166:5555";
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