/*jslint plusplus:true */
/*global exports */

function capitalizeStr(str) {
    "use strict";

    var retStr = "";

    if (str) {
        retStr = str.substr(0, 1).toUpperCase() +
                 str.substr(1, str.length - 1).toLowerCase();
    }
    
    return retStr;
}

// export if running under node
if (typeof exports !== 'undefined') {
    exports.capitalizeStr = capitalizeStr;
}