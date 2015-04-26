/*jslint nomen: true */
/*global importScripts, _, postMessage, self, onmessage,  insertCommas, capitalizeStr */
importScripts("../../bower_components/underscore/underscore.js");
importScripts("../utils.js");

function calcTotals(data) {
    "use strict";

    var results = {},
        curCrimeType,
        finalArray = [];
    _.each(data, function (val) {
        curCrimeType = val.offense;
        if (!results[curCrimeType]) {
            results[curCrimeType] = 1;
        } else {
            results[curCrimeType] += 1;
        }
    });

    for (curCrimeType in results ) {
        if (results.hasOwnProperty(curCrimeType)) {
            finalArray.push({ offense: curCrimeType,
                              offenseFormatted: capitalizeStr(curCrimeType),
                              total: results[curCrimeType],
                              totalFormatted: insertCommas(results[curCrimeType]),
                              isVisible: true});
        }
    }

    postMessage(finalArray);
}

onmessage = function (e) {
    "use strict";

    calcTotals(e.data);
};
