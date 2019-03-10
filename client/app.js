(function () {
    'use strict';

    let angular = require('angular');
    //const { upload, download, getInfo, isValidWetransfertUrl } = require('wetransfert');

    angular.module('app', [
        require('angular-sanitize'),
        require('angular-animate'),
        require('angular-ui-bootstrap'),
        require('angular-md5'),
        require('angular-route'),
        require('angular-cookies'),
        require('angular-base64-upload'),
        //require('wetransfert')
    ]);

    angular.module('app').config(config);
    angular.module('app').run(run);

    run.$inject = ['$rootScope', '$location', '$cookies', '$http'];
    config.$inject = ['$routeProvider', '$locationProvider'];

    function config($routeProvider, $locationProvider, $sceDelegateProvider) {
        $routeProvider
            .when('/', {
                controller: 'chatController',
                templateUrl: 'partials/home.view.html',
                css: "styles/chatStyle.css",
                controllerAs: 'vm'
            })

            .when('/login', {
                controller: 'LoginController',
                templateUrl: 'partials/login.view.html',
                css: "styles/loginPageStyle.css",
                controllerAs: 'vm'
            })

            .when('/register', {
                controller: 'RegisterController',
                templateUrl: 'partials/register.view.html',
                css: "styles/loginPageStyle.css",
                controllerAs: 'vm'
            })

            .otherwise({ redirectTo: '/login' });
    }

    function run($rootScope, $location, $cookies, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookies.getObject('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
        }

        $rootScope.$on('$stateChangeStart', function (event) {
            event.preventDefault();
        });

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
            var loggedIn = $rootScope.globals.currentUser;
            if (restrictedPage && !loggedIn) {
                $location.path('/login');
            }
        });
    }

})();