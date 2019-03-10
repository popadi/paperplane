﻿﻿(function () {
    'use strict';
    angular.module('app').factory('AuthenticationService', AuthenticationService);
    AuthenticationService.$inject = ['$http', '$cookies', '$rootScope', '$timeout', 'md5', 'UserService', 'ConfigService'];

    function AuthenticationService($http, $cookies, $rootScope, $timeout, md5, UserService, ConfigService) {
        var service = {};
        service.Login = login;
        service.SetCredentials = setCredentials;
        service.ClearCredentials = clearCredentials;
        return service;

        /**
         * Connects to the server and performs the authentication.
         *
         * @param username: the username
         * @param password: the password
         * @param callback: callback fct
         * @constructor
         */
        function login(username, password, callback) {
            $http({
                method: "GET",
                url: ConfigService.getPathTo("/user/authenticate"),
                params: {
                    username: username,
                    password: md5.createHash(password)
                }
            }).then(function success(response) {
                console.log(response);
                if (response.data.status !== 201) {
                    callback({
                        success: false,
                        message: 'Username or password is incorrect'
                    });
                }
                callback({
                    user: response.data.user,
                    success: true
                });
            }, function error(response) {
                console.log(response);
                callback({
                    success: false,
                    message: 'Username or password is incorrect'
                });
            });
        }

        function setCredentials(username, password, user) {
            let authdata = md5.createHash(username + ':' + password);
            user.authdata = authdata;

            $rootScope.globals = {
                currentUser: user
            };

            $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata;

            let cookieExp = new Date();
            cookieExp.setDate(cookieExp.getDate() + 7);
            $cookies.putObject('globals', $rootScope.globals, {
                expires: cookieExp
            });
        }

        function clearCredentials() {
            $rootScope.globals = {};
            $cookies.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic';
        }
    }
})();