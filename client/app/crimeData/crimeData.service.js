/*global angular, createjs */
/*jslint nomen: true */
(function () {
    "use strict";

    function crimeYearsFactory($q, $http, utils) {
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
                    src: "/api/incidents/year/2006.json"
                },
                {
                    id: "crimeData2007",
                    src: "/api/incidents/year/2007.json"
                },
                {
                    id: "crimeData2008",
                    src: "/api/incidents/year/2008.json"
                },
                {
                    id: "crimeData2009",
                    src: "/api/incidents/year/2009.json"
                },
                {
                    id: "crimeData2010",
                    src: "/api/incidents/year/2010.json"
                },
                {
                    id: "crimeData2011",
                    src: "/api/incidents/year/2011.json"
                },
                {
                    id: "crimeData2012",
                    src: "/api/incidents/year/2012.json"
                },
                {
                    id: "crimeData2013",
                    src: "/api/incidents/year/2013.json"
                },
                {
                    id: "crimeData2014",
                    src: "/api/incidents/year/2014.json"
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

        function getCrimeData(year) {
            var defer = $q.defer(),
                idx,
                foundId = false,
                dataId = "crimeData" + year,
                data;

            if (queue === null) {
                queue = new createjs.LoadQueue();

            }

            //lets try to retrieve the data from the preloader queue
            data = queue.getResult(dataId);

            if (data) {
                defer.resolve(data);
            } else {
                queue.on("complete", function () {
                    defer.resolve(queue.getResult(dataId));
                });
                queue.on("progress", function (e) {
                    defer.notify(e.progress);
                });
                queue.on("error", function (err) {
                    defer.reject("Failed to load crime data: " + err.message);
                });

                //search manifest for crime id
                for (idx = 0; idx < dataURLs.length; idx += 1) {
                    if (dataURLs[idx].id === dataId) {
                        queue.loadFile(dataURLs[idx]);
                        foundId = true;
                        break;
                    }
                }

                if (!foundId) {
                    defer.reject("Invalid file id!");
                }
            }


            return defer.promise;
        }

        function getCrimeTotals(year, filter) {
            var defer = $q.defer(),
                url = '/api/incidents/totals';

            if (year && !isNaN(year)) {
                url += '/' + year;
            }

            $http.get(url)
                .success(function (data, status, headers, config) {
                    var results = data.map(function (curObj) {
                        return {
                            offense: curObj._id,
                            offenseFormatted: utils.capitalizeStr(curObj._id),
                            total: curObj.total,
                            totalFormatted: utils.insertCommas(curObj.total),
                            isVisible: true
                        };
                    });


                    defer.resolve(results);
                })
                .error(function (err, status, headers, config) {
                    defer.reject(err);
                });

            return defer.promise;
        }

        // Public API here
        return {
            yearsData: data,
            dataURLs: dataURLs,
            getData: getCrimeData,
            updateCurYear: updateCurYear,
            getCrimeTotals: getCrimeTotals
        };
    }

    angular.module('dcCrimeHeatmapApp.crimeDataFactory', ['dcCrimeHeatmapApp.utils'])
        .factory('crimeData', crimeYearsFactory);
}());
