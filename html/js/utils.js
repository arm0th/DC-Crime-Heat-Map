/*jslint plusplus:true, regexp: true */
/*global exports */

function capitalizeStr(str) {
    "use strict";

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

// export if running under node
if (typeof exports !== 'undefined') {
    exports.capitalizeStr = capitalizeStr;
}