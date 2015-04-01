/*jslint nomen: true */
/*global angular,$, L, Backbone, console, alert, Handlebars, Worker, insertCommas, generateKey, _ */
(function () {
    'use strict';
    var app = angular.module('dcCrimeHeatmapApp.mainController', [
        'dcCrimeHeatmapApp.modalComponent',
        'dcCrimeHeatmapApp.mainMap',
        'dcCrimeHeatmapApp.legend',
        'dcCrimeHeatmapApp.mainMap.icons'
    ]);
    app.controller('MainCtrl', function ($scope, $http, $timeout, socket, crimeData, Modal, IconFactory) {
        var main = this,
            App = window.App || {},
            MainApp = {
                worker: null,
                totalsWorker: null,
                initialize: function () {
                    var self = this;

                    //download all crime data
                    this.downloadData();
                },
                downloadData: function () {
                    var that = this,
                        getCurData = function (m) {
                            console.log('MainCtlr::curData - ' + m);
                            return crimeData.getData(crimeData.yearsData.curYear);
                        },
                        populateData = function (data) {
                            that.calcTotals(data);
                            return data;
                        };

                    getCurData()
                        .then(populateData)
                        .then(function (data) {
                            console.log("All data loaded!");
                            $timeout(function () {
                                $("#progressContainer").css("display", "none");
                            }, 500);

                            $scope.status.curCrimeData = data;

                            $scope.$watch(function () {return crimeData.yearsData.curYear; },
                                function (newVal, oldVal, s) {
                                    console.log("year updated:" + newVal);
                                    App.updateYear(newVal);
                                });

                        },
                            function (err) {
                                console.log("FAIL :(");
                            },
                            function (prog) {
                                $scope.status.progress = Math.round(prog * 100);
                            });
                },
                updateYear: function (year) {
                    var self = this;

                    $scope.status.progress = 0;
                    $("#progressContainer").css("display", "block");
                    crimeData.getData(year).then(function (data) {
                        //hide load bar
                        $timeout(function () {
                            $("#progressContainer").css("display", "none");
                        }, 500);

                        $scope.status.curCrimeData = data;
                        self.calcTotals(data);
                        data = null;
                    }, function (err) {
                        console.err("Failed somehow!");
                    }, function (prog) {
                        $scope.status.progress = Math.round(prog * 100);
                    });

                },
                calcTotals: function (data) {
                    if (typeof (Worker) !== "undefined") {
                        //if a worker is running, stop it
                        if (this.totalsWorker !== null) {
                            this.totalsWorker.terminate();
                        }

                        this.totalsWorker = new Worker("app/workers/calcTotalsWorker.js");

                        this.totalsWorker.onmessage = function (e) {
                            var totals = e.data,
                                curTotal,
                                template,
                                htmlStr;

                            //update crime totals
                            $scope.status.curCrimeTotals = e.data.map(function (item) {
                                item.iconSrc = IconFactory.getIconPath(item.offense);
                                item.key = generateKey(item.offense);
                                return item;
                            });

                            $scope.legendState = e.data.reduce(function (prev, cur) {
                                //add key value pairs to an object
                                prev[cur.key] = true;
                                return prev;
                            }, {});


                        };

                        //start the web worker
                        this.totalsWorker.postMessage(data);
                    } else {
                        alert("Web workers aren't supported on your browser. No plotting for you!");
                    }
                },
                showMessage: function (msg) {
                    //show modal
                    var modal = Modal.info(),
                        modalInstance = modal('Data complete', msg);

                    //hide the modal it after a few seconds
                    setTimeout(function () {
                        modalInstance.close();
                    }, 1500);
                }

            };

        $scope.status = {
            progress: 0,
            curCrimeData: [],
            curCrimeTotals: [],
            crimeLegend: []
        };

        $scope.legendState = {};

        //on document ready
        $(function () {
            //extend everything from main app
            _.extend(App, MainApp);

            App.initialize();
        });


        //    $scope.awesomeThings = [];
        //
        //    $http.get('/api/things').success(function(awesomeThings) {
        //      $scope.awesomeThings = awesomeThings;
        //      socket.syncUpdates('thing', $scope.awesomeThings);
        //    });
        //
        //    $scope.addThing = function() {
        //      if($scope.newThing === '') {
        //        return;
        //      }
        //      $http.post('/api/things', { name: $scope.newThing });
        //      $scope.newThing = '';
        //    };
        //
        //    $scope.deleteThing = function(thing) {
        //      $http.delete('/api/things/' + thing._id);
        //    };
        //
        //    $scope.$on('$destroy', function () {
        //      socket.unsyncUpdates('thing');
        //    });
    });
}());
