(function () {
    'use strict';
    angular.module('app').factory('EmoticonsService', EmoticonsService);

    function EmoticonsService() {
        let service = {};

        service.getEmoticons = function () {
            return {
                emoticons: [
                    "\ud83d\ude00",
                    "\ud83d\ude01",
                    "\ud83d\ude02",
                    "\ud83d\ude03",
                    "\ud83d\ude04",
                    "\ud83d\ude05",
                    "\ud83d\ude06",
                    "\ud83d\ude07",
                    "\ud83d\ude08",
                    "\ud83d\ude09",
                    "\ud83d\ude0A",
                    "\ud83d\ude0B",
                    "\ud83d\ude0C",
                    "\ud83d\ude0D",
                    "\ud83d\ude0E",
                    "\ud83d\ude0F",
                    "\ud83d\ude10",
                    "\ud83d\ude11",
                    "\ud83d\ude12",
                    "\ud83d\ude13",
                    "\ud83d\ude14",
                    "\ud83d\ude15",
                    "\ud83d\ude16",
                    "\ud83d\ude17",
                    "\ud83d\ude18",
                    "\ud83d\ude19",
                    "\ud83d\ude1A",
                    "\ud83d\ude1B",
                    "\ud83d\ude1C",
                    "\ud83d\ude1D",
                    "\ud83d\ude1E",
                    "\ud83d\ude1F",
                    "\ud83d\ude20",
                    "\ud83d\ude21",
                    "\ud83d\ude22",
                    "\ud83d\ude23",
                    "\ud83d\ude24",
                    "\ud83d\ude25",
                    "\ud83d\ude26",
                    "\ud83d\ude27",
                    "\ud83d\ude28",
                    "\ud83d\ude29",
                    "\ud83d\ude2A",
                    "\ud83d\ude2B",
                    "\ud83d\ude2C",
                    "\ud83d\ude2D",
                    "\ud83d\ude2E",
                    "\ud83d\ude2F",
                    "\ud83d\ude30",
                    "\ud83d\ude31",
                    "\ud83d\ude32",
                    "\ud83d\ude33",
                    "\ud83d\ude34",
                    "\ud83d\ude35",
                    "\ud83d\ude36",
                    "\ud83d\ude37",
                    "\ud83d\ude38",
                    "\ud83d\ude39",
                    "\ud83d\ude3A",
                    "\ud83d\ude3B",
                    "\ud83d\ude3C",
                    "\ud83d\ude3D",
                    "\ud83d\ude3E",
                    "\ud83d\ude3F",
                    "\ud83d\ude40",
                    "\ud83d\ude41",
                    "\ud83d\ude42",
                    "\ud83d\ude43",
                    "\ud83d\ude44",
                    "\ud83d\ude45",
                    "\ud83d\ude46",
                    "\ud83d\ude47",
                    "\ud83d\ude48",
                    "\ud83d\ude49",
                    "\ud83d\ude4A",
                    "\ud83d\ude4B",
                    "\ud83d\ude4C",
                    "\ud83d\ude4D",
                    "\ud83d\ude4E",
                    "\ud83d\ude4F",

                    "\ud83d\udc4D",
                ]
            }
        };

        service.keyboardEmoticons = {
            "(y)": "\ud83d\udc4D",
            ":d": "\ud83d\ude01",
            ":D": "\ud83d\ude01",
            ":)": "\ud83d\ude0A",
            "<3": "\ud83d\udc93",
        };

        return service;
    }
})();
