/*global angular */
/*jslint nomen: true */
(function () {
    'use strict';

    angular.module('dcCrimeHeatMapApp')
        .factory('utils', function () {
            // Service logic
            // ...

            function capitalizeStr(str) {
                var retStr = "",
                    newStr,
                    tokens;

                if (str) {
                    retStr = str;
                    tokens = str.split(/[^\.]\.\s+/);

                    tokens.forEach(function (s) {
                        newStr = s.substr(0, 1).toUpperCase() +
                                 s.substr(1, s.length - 1).toLowerCase();
                        retStr = retStr.replace(s, newStr);
                    });

                }

                return retStr;
            }

            function insertCommas(num) {
                var str = num.toString(),
                    chars = [],
                    curChar,
                    idx = 0,
                    digitIdx,
                    decimalDigits = "";

                if (isNaN(str)) {
                    //if this isn't a number, lets not waste time
                    return "";
                }

                //check for negative number
                if (Number(str) < 0) {
                    //remove the negative sign and add to stack
                    str = str.substr(1, str.length - 1);
                    chars.push("-");
                }

                //check for decimal
                if (str.match(/[\-]*\d+\.[\d]+/)) {
                    //retreive the decimal portion of the number
                    decimalDigits = str.replace(/[\-]*\d+\./, ".");
                    //chop the decimal portion of the nummber off
                    str = str.replace(/\.\d+/, "");
                }

                idx = 0;
                for (digitIdx = str.length; digitIdx >= 1; digitIdx -= 1) {
                    //loop through each digit and determine where the commas go
                    if ((idx !== 0) && (digitIdx % 3 === 0)) {
                        chars.push(",");
                    }
                    curChar = str.substr(idx, 1);
                    chars.push(curChar);
                    idx += 1;
                }

                return chars.join("") + decimalDigits;
            }

            function generateKey(str) {
                var keyStr = "";

                if (!str) {
                    return "";
                }

                keyStr = str.toLowerCase()
                            .replace(/[^a-zA-Z0-9]/g, "");


                return keyStr;
            }

            // Public API here
            return {
                capitalizeStr: capitalizeStr,
                insertCommas: insertCommas,
                generateKey: generateKey
            };
        });
}());
