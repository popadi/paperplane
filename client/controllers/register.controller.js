(function () {
    'use strict';
    angular.module('app').controller('RegisterController', RegisterController);
    RegisterController.$inject = ['UserService', '$location', '$rootScope', 'FlashService'];

    function RegisterController(UserService, $location, $rootScope, FlashService) {
        let vm = this;
        vm.register = register;

        function register() {
            vm.dataLoading = true;
            UserService.create(vm.user)
                .then(function (response) {
                    if (response.success) {
                        FlashService.Success('Registration successful', true);
                        $location.path('/login');
                    } else {
                        FlashService.Error(response.message);
                        vm.dataLoading = false;
                    }
                });
        }
    }
})();
