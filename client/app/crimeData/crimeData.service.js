/*global angular, createjs */
(function () {
    "use strict";

    function crimeYearsFactory($q) {
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
            ],
            queue = null;

        //add all years into an array
        while (index >= startYear) {
            data.years.push(index);
            index -= 1;
        }

        function updateCurYear(year) {
            //$scope.$apply(function () {
                data.curYear = year;
            //});
        }

        function downloadData() {
            var defer = $q.defer();

            if (queue === null) {
                queue = new createjs.LoadQueue();

                queue.on("complete", function () {
                    defer.resolve("Finished loading!");
                });
                queue.on("progress", function (e) {
                    defer.notify(e.progress);
                });
                queue.on("error", function (err) {
                    defer.reject("Failed to load crime data: " + err.message);
                });

                queue.loadManifest(dataURLs);
            }

            return defer.promise;
        }

        function getCrimeData(year) {
            var defer = $q.defer(),
                data = queue.getResult("crimeData" + year);

            defer.resolve(data);

            return defer.promise;
        }

        // Public API here
        return {
            yearsData: data,
            dataURLs: dataURLs,
            downloadData: downloadData,
            getData: getCrimeData,
            updateCurYear: updateCurYear
        };
    }

    angular.module('dcCrimeHeatmapApp.crimeDataFactory', [])
        .factory('crimeData', crimeYearsFactory);
}());
