/*global angular, insertCommas, L, Worker */
(function () {
    'use strict';

    angular.module('dcCrimeHeatmapApp.mainMap', [
        'dcCrimeHeatMapApp.mainMap.ctrl',
        'dcCrimeHeatmapApp.mainMap.icons',
        'dcCrimeHeatmapApp.crimeDataFactory'
    ])
        .directive('mainMap', function (IconFactory, crimeData, $q) {
            var config = {
                    minZoom: 11,
                    startZoom: 12,
                    maxZoom: 19,
                    startCoords: [38.9, -77.02]
                },
                map,
                worker = null,
                curHeatLayer,
                clusterLayer;

            function initMap(config) {
                //set up map
                var map = L.mapbox.map('map', 'uknowho.map-wc8j7l0g', {
                        minZoom: config.minZoom,
                        maxZoom: config.maxZoom
                    }).setView(config.startCoords, config.startZoom);

                //add heat layer with empty set for now
                curHeatLayer = L.heatLayer([], {
                    maxZoom: config.maxZoom,
                    max: 0.7,
                    radius: 30
                });
                curHeatLayer.addTo(map);

                //create cluster layer where all the points are held
                clusterLayer = L.markerClusterGroup({
                    iconCreateFunction: function (cluster) {
                        var childCount = cluster.getChildCount(),
                            c = ' marker-cluster-';
                        if (childCount < 10) {
                            c += 'small';
                        } else if (childCount < 100) {
                            c += 'medium';
                        } else {
                            c += 'large';
                        }

                        return new L.DivIcon({
                            html: '<div><span>' + insertCommas(childCount) + '</span></div>',
                            className: 'marker-cluster' + c,
                            iconSize: new L.Point(40, 40)
                        });
                    }
                });
                clusterLayer.addTo(map);

                return map;
            }

            function loadHeatMapLayer(m, heatLayer, cData) {
                if (heatLayer) {
                    heatLayer.setLatLngs(cData);
                }
            }

            function loadClusterData(data, clusterGroup, legendState) {
                var defer = $q.defer();
                //remove all points before proceeding
                clusterGroup.clearLayers();

                //TODO: handle this better for unsupported browsers
                //check if browser supports web workers
                if (typeof (Worker) !== "undefined") {
                    //if a worker is running, stop it
                    if (worker !== null) {
                        worker.terminate();
                    }

                    worker = new Worker("app/workers/genClusterLayer.js");

                    worker.onmessage = function (e) {
                        var obj = e.data,
                            idx,
                            curCoord,
                            marker,
                            curMarkers = [],
                            options = {};
                        if (obj.status === "loading") {
                            for (idx = 0; idx < obj.data.length; idx += 1) {
                                curCoord = obj.data[idx];
                                options = {
                                    icon: IconFactory.genIcon(curCoord[2])
                                };

                                marker = L.marker([curCoord[0], curCoord[1]], options);
                                marker.bindPopup(curCoord[2]);
                                curMarkers.push(marker);
                            }
                            clusterGroup.addLayers(curMarkers);
                        } else if (obj.status === "complete") {
                            //show message
                            //parent.showMessage("Loaded Crime data points");
                            defer.resolve("Finished loading data points");
                        }
                    };

                    //pass in the Leaflet object to the worker
                    worker.postMessage({
                        data: data,
                        filter: legendState
                    });
                } else {
                    defer.reject("Web workers aren't supported on your browser. No plotting for you!");
                }

                return defer.promise;
            }

            function updateYear(year, cData) {
                cData.getData(year).then(function (data) {
                    if (map) {
                        loadHeatMapLayer(map, data);
                    }

                    if (clusterLayer) {
                        loadClusterData(data, clusterLayer);
                    }

                    //self.calcTotals(data);
                    data = null;
                });
            }

            return {
                templateUrl: 'app/mainMap/mainMap.html',
                restrict: 'EA',
                controller: 'MainMapCtrl',
                controllerAs: 'ctrl',
                bindToController: true,
                link: function (scope, element, attrs) {
                    //initialize map
                    map = initMap(config);

                    scope.$watch('status.curCrimeData', function (newVal, oldVal) {
                        if (newVal) {
                            if (map) {
                                loadHeatMapLayer(map, curHeatLayer, newVal);
                                loadClusterData(newVal, clusterLayer, undefined).then(
                                    function (msg) {
                                        console.log("Success:" + msg);
                                    },
                                    function (err) {
                                        console.error("Failure:" + err);
                                    }
                                );
                            }
                        }
                    });
                }
            };
        });

}());
