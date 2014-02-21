/*global importScripts, _, postMessage, self, onmessage */
importScripts("../../bower_components/underscore/underscore.js");

function calcTotals(data) {
    "use strict";

    var results = {},
        curCrimeType,
        finalArray = [];
    _.each(data, function (val) {
        curCrimeType = val[2];
        if (!results[curCrimeType]) {
            results[curCrimeType] = 1;
        } else {
            results[curCrimeType] += 1;
        }
    });
    
    for (curCrimeType in results ) {
        if (results.hasOwnProperty(curCrimeType)) {
            finalArray.push({ offense: curCrimeType, total: results[curCrimeType]});
        }
    }

    postMessage(finalArray);
}

onmessage = function (e) {
    "use strict";

    calcTotals(e.data);
};