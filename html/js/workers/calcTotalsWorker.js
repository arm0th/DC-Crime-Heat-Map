/*global importScripts, _ */
importScripts("../../bower_components/underscore/underscore.js");

var results = {};

function calcTotals(data) {
    "use strict";

    var curCrimeType;
    _.each(data, function (val) {
        curCrimeType = val[2];
        if (!self.results[curCrimeType]) {
            self.results[curCrimeType] = 1;
        } else {
            self.results[curCrimeType] += 1;
        }
    });
    
    postMessage(self.results);
}

onmessage = function (e) {
    "use strict";

    calcTotals(e.data);
};