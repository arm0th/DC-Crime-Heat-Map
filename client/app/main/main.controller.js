/*jslint nomen: true */
/*global angular,$, L, Backbone, console, alert, Handlebars, Worker, insertCommas, _ */
(function () {
    'use strict';
    var app = angular.module('dcCrimeHeatmapApp.mainController', [
        'dcCrimeHeatmapApp.modalComponent',
        'dcCrimeHeatmapApp.mainMap',
        'dcCrimeHeatmapApp.legend'
    ]);
    app.controller('MainCtrl', function ($scope, $http, $timeout, socket, crimeData, Modal) {
        var main = this,
            App = window.App || {},
            MainApp = {
                map: null,
                curHeatLayer: null,
                clusterLayer: null, // object to store point layer groups
                worker: null,
                totalsWorker: null,
                legendView: null,
                initialize: function () {
                    var self = this;

                    //download all crime data
                    this.downloadData();

                    $("#layerButtons a").click(function (e) {
                        var btnEl = $(this),
                            btnName = btnEl.text();

                        $("#layerButtons a").removeClass("activeButton");
                        btnEl.addClass("activeButton");
                    });

                    //this.registerHandlebarsHelpers();
                },
                registerHandlebarsHelpers: function () {
                    var parent = this;

                    Handlebars.registerHelper('listCrime', function (items, options) {
                        var key,
                            idx,
                            curData,
                            curImgTag,
                            html = "<ul>\n";

                        for (idx = 0; idx < items.length; idx += 1) {
                            curData = items[idx];
                            curImgTag = '<img class="mapLegendIcon" src="' +
                                parent.IconFactory.getIconPath(curData.offense) +
                                '" alt="' + curData.offenseFormatted + ' icon" >';
                            html += "\t<li>" + curImgTag + " " +
                                options.fn(curData) +
                                "<input class='mapLegendToggle' " +
                                "data-offense='" + curData.offense + "' " +
                                "type='checkbox' checked>" +
                                "</li>\n";
                        }

                        return html + "</ul>";
                    });
                },
                downloadData: function () {
                    var that = this,
                        getCurData = function (m) {
                            console.log(m);
                            return crimeData.getData(crimeData.yearsData.curYear);
                        },
                        populateData = function (data) {
                            that.calcTotals(data);
                            return data;
                        };

                    crimeData.downloadData()
                        .then(getCurData)
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

                    crimeData.getData(year).then(function (data) {
                        $scope.status.curCrimeData = data;
                        self.calcTotals(data);
                        data = null;
                    });

                },
                calcTotals: function (data) {
                    var parent = this,
                        legendModel = new this.MapLegendModel({
                            crimeTotals: new parent.CrimeTotalsCollection()
                        });

                    //                if (this.legendView === null) {
                    //                    this.legendView = new this.MapLegendView({model: legendModel});
                    //                    //set up listener for when map legend is toggled
                    //                    this.legendView.on("mapLegned:legendToggled", function (e) {
                    //                        var curData = parent.downloadQueue.getResult("crimeData" + parent.curYear);
                    //
                    //                        parent.loadClusterData(curData, parent.clusterLayer, e.legendState);
                    //                        //alert("TODO: handle legend toggled event!" + curData);
                    //                    });
                    //                }

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
                            $scope.status.curCrimeTotals = e.data;
                            $scope.status.crimeLegend = e.data.map(function (item) {
                                return {
                                    label: item.offense,
                                    isVisible: item.isVisible
                                }
                            });
                            console.dir($scope.status.crimeLegend)

                            //parent.legendView.model.set({crimeTotals: totals });
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
            curCrimeTotals: []
        };

        //define backbone objects
        App.CrimeTotalsModel = Backbone.Model.extend({
            id: "",
            offense: "",
            offenseFormatted: "",
            total: 0,
            totalFormatted: ""
        });

        App.CrimeTotalsCollection = Backbone.Collection.extend({
            model: App.CrimeTotalsModel
        });

        App.MapLegendModel = Backbone.Model.extend({
            crimeTotals: []
        });

        //on document ready
        $(function () {
            //initialize foundation
            //$(document).foundation();

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
