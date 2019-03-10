(function () {
    'use strict';
    angular.module('app').factory('UtilsService', UtilsService);

    function UtilsService() {
        let service = {};

        service.formatMessageDate = function(epoch) {
            let tf = new Date(epoch);
            let td = new Date();

            let yy = tf.getFullYear();
            let mm = tf.getMonth();
            let dd = tf.getDate();

            let m = tf.getMinutes();
            let h = tf.getHours();

            if (td.getDate() === dd) {
                return [('0' + h).slice(-2), ('0' + m).slice(-2)].join(":");
            } else {
                return [('0' + dd).slice(-2), ('0' + mm).slice(-2), yy].join("/")
                    + " " + [('0' + h).slice(-2), ('0' + m).slice(-2)].join(":");
            }
        };

        return service;
    }
})();
