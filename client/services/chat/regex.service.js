(function () {
    'use strict';
    angular.module('app').factory('RegexerService', RegexerService);

    function RegexerService() {
        let service = {};

        /**
         *
         * @param content
         */
        service.checkForYoutubeLink = function(content) {
            let re = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
            let found = content.match(re);

            if (found && found.length > 0) {
                return found[0];
            } else {
                return "";
            }
        };

        /**
         *
         * @param content
         */
        service.checkForImageLink = function (content) {
            let re = /^((http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg|gif|svg)))/;
            let found = content.match(re);

            if (found && found.length > 0) {
                return found[0];
            } else {
                return "";
            }
        };

        /**
         *
         * @param content
         * @returns {*}
         */
        service.checkForBasicURL = function(content) {
            var re = /^(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*))/;
            let found = content.match(re);

            if (found && found.length > 0) {
                return found[0];
            } else {
                return "";
            }
        };

        return service;
    }
})();
