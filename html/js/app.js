/*jslint plusplus: true, nomen: true */
/*global document, $, L, createjs, Worker, setTimeout, Handlebars, window, _*/

var App = window.App || {},
    MainApp = {
        map: null,
        curHeatLayer: null,
        clusterLayer: {}, // object to store point layer groups
        worker: null,
        totalsWorker: null,
        legendView: null,
        config: {
            minZoom: 11,
            startZoom: 12,
            maxZoom: 19,
            startCoords: [38.9, -77.02]
        },
        initialize: function () {
            "use strict";

            var self = this;

            //download all heatmap data
            this.downloadQueue = this.downloadData();

            this.map = this.initMap();

            $("#yearDropItems").click(function (e) {
                var newYear = e.target.innerText,
                    data = self.downloadQueue.getResult("crimeData" + newYear);
                self.loadHeatMapLayer(self.map, data);

                self.loadClusterData(data, self.clusterLayer);

                self.calcTotals(data);

                //NOTE: this refers to the dropdown
                $("#yearDropBtn").text(newYear);
                $(this).removeClass("open"); //should hide the dropdown but does not
                this.style.left = "-999999px"; // TODO: find a better way!
            });

            $("#layerButtons a").click(function (e) {
                var btnEl = $(this),
                    btnName = btnEl.text();

                $("#layerButtons a").removeClass("activeButton");
                btnEl.addClass("activeButton");
            });

            this.registerHandlebarsHelpers();
        },
        initMap: function () {
            "use strict";

            //set up map
            var parent = this,
                map = L.mapbox.map('map', 'uknowho.map-wc8j7l0g', {
                    minZoom: parent.config.minZoom,
                    maxZoom: parent.config.maxZoom
                }).setView(parent.config.startCoords, parent.config.startZoom);

            //add heat layer with empty set for now
            this.curHeatLayer = L.heatLayer([], {
                maxZoom: parent.config.maxZoom,
                max: 0.7,
                radius: 30
            });
            this.curHeatLayer.addTo(map);

            //create cluster layer where all the points are held
            this.clusterLayer = L.markerClusterGroup({
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

                    return new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>', className: 'marker-cluster' + c, iconSize: new L.Point(40, 40) });
                }
            });
            this.clusterLayer.addTo(map);

            return map;
        },
        registerHandlebarsHelpers: function () {
            "use strict";

            var parent = this;

            Handlebars.registerHelper('listCrime', function (items, options) {
                var key,
                    idx,
                    curData,
                    curImgTag,
                    html = "<ul>\n";

                for (idx = 0; idx < items.length; idx++) {
                    curData = items[idx];
                    curImgTag = '<img class="mapLegendIcon" src="' +
                                parent.IconFactory.getIconPath(curData.offense) +
                                '" alt="' + curData.offense + ' Icon" >';
                    html += "\t<li>" + curImgTag + " " + options.fn(curData) + "</li>\n";
                }

                return html + "</ul>";
            });
        },
        loadHeatMapLayer: function (m, crimeData) {
            "use strict";

            if (this.curHeatLayer) {
                this.curHeatLayer.setLatLngs(crimeData);
            }
        },
        dataURLs: [
            { id: "crimeData2006", src: "js/data/crimeDataCoords_2006.json" },
            { id: "crimeData2007", src: "js/data/crimeDataCoords_2007.json" },
            { id: "crimeData2008", src: "js/data/crimeDataCoords_2008.json" },
            { id: "crimeData2009", src: "js/data/crimeDataCoords_2009.json" },
            { id: "crimeData2010", src: "js/data/crimeDataCoords_2010.json" },
            { id: "crimeData2011", src: "js/data/crimeDataCoords_2011.json" },
            { id: "crimeData2012", src: "js/data/crimeDataCoords_2012.json" },
            { id: "crimeData2013", src: "js/data/crimeDataCoords_2013.json" }
        ],
        downloadQueue: {},
        downloadCompleteHandler: function () {
            "use strict";

            var data = this.downloadQueue.getResult("crimeData2013");
            this.loadHeatMapLayer(this.map, data);
            $("#progressContainer").css("display", "none");

            this.calcTotals(data);

            this.loadClusterData(data, this.clusterLayer);
        },
        downloadData: function () {
            "use strict";

            var queue = new createjs.LoadQueue(),
                progBar = $("#progressBar"),
                progBarMeter = progBar.find("span");

            queue.on("complete", this.downloadCompleteHandler, this);
            queue.on("progress", function (e) {
                //TODO: refactor this, we shouldn't hardcode things
                var newWidth = 200  * e.progress;
                progBarMeter.css("width", newWidth + "px");
            });
            queue.on("error", function () {
                alert("Failed to load crime data");
            });
    //        queue.on("fileload", function () {
    //            //do we need to do something after something loads?
    //        });
            queue.loadManifest(this.dataURLs);

            return queue;
        },
        loadClusterData: function (data, clusterGroup) {
            "use strict";

            var parent = this;

            //remove all points before proceeding
            clusterGroup.clearLayers();

            //TODO: handle this better for unsupported browsers
            //check if browser supports web workers
            if (typeof (Worker) !== "undefined") {
                //if a worker is running, stop it
                if (this.worker !== null) {
                    this.worker.terminate();
                }

                this.worker = new Worker("js/workers/genClusterLayer.js");

                this.worker.onmessage = function (e) {
                    var obj = e.data,
                        idx,
                        curCoord,
                        marker,
                        curMarkers = [],
                        options = {};
                    if (obj.status === "loading") {


                        for (idx = 0; idx < obj.data.length; idx++) {
                            curCoord = obj.data[idx];
                            options = { icon: parent.IconFactory.genIcon(curCoord[2]) };

                            marker = L.marker([curCoord[0], curCoord[1]], options);
                            marker.bindPopup(curCoord[2]);
                            curMarkers.push(marker);
                        }
                        clusterGroup.addLayers(curMarkers);
                    } else if (obj.status === "complete") {
                        //show message
                        parent.showMessage("Loaded Crime data points");
                    }
                };

                //pass in the Leaflet object to the worker
                this.worker.postMessage(data);
            } else {
                alert("Web workers aren't supported on your browser. No plotting for you!");
            }
        },
        calcTotals: function (data) {
            "use strict";

            var parent = this,
                legendModel = new this.MapLegendModel({
                    crimeTotals: new parent.CrimeTotalsCollection()
                });

            if (this.legendView === null) {
                this.legendView = new this.MapLegendView({model: legendModel});
            }

            if (typeof (Worker) !== "undefined") {
                //if a worker is running, stop it
                if (this.totalsWorker !== null) {
                    this.totalsWorker.terminate();
                }

                this.totalsWorker = new Worker("js/workers/calcTotalsWorker.js");

                this.totalsWorker.onmessage = function (e) {
                    var totals = e.data,
                        curTotal,
                        template,
                        htmlStr;

//                    for (curTotal in totals) {
//                        if (totals.hasOwnProperty(curTotal)) {
//                            console.log("cur total:" + curTotal +  " = " + totals[curTotal]);
//                        }
//                    }

                    //populate totals
                    //TODO: cache template
                    //template = Handlebars.compile($("#crimeTotalsTemplate").html());
                    //htmlStr = template({crimeTotals: totals });
                    //$("#crimeTotals").html(htmlStr);
                    parent.legendView.model.set({crimeTotals: totals });
                };

                //start the web worker
                this.totalsWorker.postMessage(data);
            } else {
                alert("Web workers aren't supported on your browser. No plotting for you!");
            }
        },
        IconFactory: {
            iconURLs: {
                RedIcon: '../images/marker-icon-red.png',
                TheftIcon: '../images/theft.png',
                HomicideIcon: '../images/homicide.png',
                CarIcon: '../images/car.png',
                RobberyIcon: '../images/robbery.png',
                SexAssultIcon: '../images/sex_assult.png'
            },
            icons: {
                RedIcon: L.Icon.Default.extend({
                    options: {
                        iconUrl: '../images/marker-icon-red.png'
                    }
                }),
                TheftIcon: L.Icon.Default.extend({
                    options: {
                        iconSize: [30, 30],
                        iconAnchor: [15, 30],
                        iconUrl: '../images/theft.png'
                    }
                }),
                HomicideIcon: L.Icon.Default.extend({
                    options: {
                        iconSize: [30, 30],
                        iconAnchor: [15, 30],
                        iconUrl: '../images/homicide.png'
                    }
                }),
                CarIcon: L.Icon.Default.extend({
                    options: {
                        iconSize: [30, 30],
                        iconAnchor: [15, 30],
                        iconUrl: '../images/car.png'
                    }
                }),
                RobberyIcon: L.Icon.Default.extend({
                    options: {
                        iconSize: [30, 30],
                        iconAnchor: [15, 30],
                        iconUrl: '../images/robbery.png'
                    }
                }),
                SexAssultIcon:  L.Icon.Default.extend({
                    options: {
                        iconSize: [30, 30],
                        iconAnchor: [15, 30],
                        iconUrl: '../images/sex_assult.png'
                    }
                })

            },
            getIconKey: function (offenseType) {
                "use strict";

                var iconKey;

                if (offenseType.match(/HOMICIDE/)) {
                    iconKey = "HomicideIcon";
                } else if (offenseType.match(/MOTOR VEHICLE/)) {
                    iconKey = "CarIcon";
                } else if (offenseType.match(/.*THEFT.*/)) {
                    iconKey = "TheftIcon";
                } else if (offenseType.match(/ROBBERY/)) {
                    iconKey = "RobberyIcon";
                } else if (offenseType.match(/SEX.*/)) {
                    iconKey = "SexAssultIcon";
                } else {
                    iconKey = "RedIcon";
                }

                return iconKey;
            },
            getIconPath: function (offenseType) {
                "use strict";

                var iconKey = this.getIconKey(offenseType);
                
                //return relative URL path based off of iconKey
                return this.iconURLs[iconKey];
            },
            genIcon: function (offenseType) {
                "use strict";

                var iconKey = this.getIconKey(offenseType);

                //instanciate icon and return it
                return new this.icons[iconKey]();
            }
        },
        showMessage: function (msg) {
            "use strict";

            //populate data with text
            $("#messageModal p").html("<h5>" + msg + "</h5>");

            //show modal
            $('#messageModal').foundation('reveal', 'open');

            //hide it after a few seconds
            setTimeout(function () {
                $('#messageModal').foundation('reveal', 'close');
            }, 1500);
        }

    };

//on document ready
$(function () {
    "use strict";

    //initialize foundation
    $(document).foundation();
    
    //extend everything from main app
    _.extend(App, MainApp);
    
    App.initialize();
});
