/*global angular */
(function () {
    "use strict";

    function crimeYearsFactory() {
        var startYear = 2006,
            endYear = 2014,
            index = endYear,
            data = {
                years: [],
                curYear: endYear
            };

        //add all years into an array
        while (index >= startYear) {
            data.years.push(index);
            index -= 1;
        }

        // Public API here
        return {
            yearsData: data
        };
    }

    angular.module('dcCrimeHeatmapApp')
        .factory('crimeYears', crimeYearsFactory);
}());
