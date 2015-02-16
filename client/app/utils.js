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

function insertCommas(num) {
    "use strict";

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
    for (digitIdx = str.length; digitIdx >= 1; digitIdx--) {
        //loop through each digit and determine where the commas go
        if ((idx !== 0) && (digitIdx % 3 === 0)) {
            chars.push(",");
        }
        curChar = str.substr(idx, 1);
        chars.push(curChar);
        idx++;
    }

    return chars.join("") + decimalDigits;
}

// export if running under node
if (typeof exports !== 'undefined') {
    exports.capitalizeStr = capitalizeStr;
    exports.insertCommas = insertCommas;
}
