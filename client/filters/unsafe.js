angular.module('app').filter('unsafe', function($sce) {
    function nl2br (str, is_xhtml) {
        var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
        return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
    }

    return function(val) {
        return $sce.trustAsHtml(nl2br(val));
    };
});