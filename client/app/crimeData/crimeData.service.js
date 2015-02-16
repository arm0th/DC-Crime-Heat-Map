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
            },
            dataURLs = [
                {
                    id: "crimeData2006",
                    src: "app/data/crimeDataCoords_2006.json"
                },
                {
                    id: "crimeData2007",
                    src: "app/data/crimeDataCoords_2007.json"
                },
                {
                    id: "crimeData2008",
                    src: "app/data/crimeDataCoords_2008.json"
                },
                {
                    id: "crimeData2009",
                    src: "app/data/crimeDataCoords_2009.json"
                },
                {
                    id: "crimeData2010",
                    src: "app/data/crimeDataCoords_2010.json"
                },
                {
                    id: "crimeData2011",
                    src: "app/data/crimeDataCoords_2011.json"
                },
                {
                    id: "crimeData2012",
                    src: "app/data/crimeDataCoords_2012.json"
                },
                {
                    id: "crimeData2013",
                    src: "app/data/crimeDataCoords_2013.json"
                },
                {
                    id: "crimeData2014",
                    src: "app/data/crimeDataCoords_2014.json"
                }
            ];

        //add all years into an array
        while (index >= startYear) {
            data.years.push(index);
            index -= 1;
        }

        // Public API here
        return {
            yearsData: data,
            dataURLs: dataURLs
        };
    }

    angular.module('dcCrimeHeatmapApp')
        .factory('crimeData', crimeYearsFactory);
}());
