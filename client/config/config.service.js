(function () {
    'use strict';

    angular.module('app').factory('ConfigService', ConfigService);

    function ConfigService() {
        //let IP = "http://127.0.0.1";
        let IP = "http://142.93.84.166";
        let port = "8888";
        let service = {};

        service.getServerAddress = getServerAddress;
        service.getPathTo = getPathTo;

        function getServerAddress() {
            return IP + ":" + port;
        }

        function getPathTo(rest) {
            return getServerAddress() + rest;
        }

        return service;
    }
})();