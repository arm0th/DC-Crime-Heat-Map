/*global document, $, L, createjs */
var App = {
    map: null,
    curHeatLayer: null,
    pointLayers: {}, // object to store point layer groups
    worker: null,
    initialize: function () {
        "use strict";
        
        var self = this;

        //download all heatmap data
        this.downloadQueue = this.downloadData();

        this.map = this.initMap();

        $("#yearDropItems").click(function (e) {
            var newYear = e.target.innerText,
                data = self.downloadQueue.getResult("crimeData" + newYear);
            self.curHeatLayer = self.loadHeatMapLayer(self.map, data);
            //alert("we got something: " + newYear);
            //NOTE: this refers to the dropdown
            $("#yearDropBtn").text(newYear);
            $(this).removeClass("open"); //hides the dropdown
            this.style.left = "-999999px"; // TODO: find a better way!
        });
        
        $("#layerButtons a").click(function (e) {
            var btnEl = $(this),
                btnName = btnEl.text();

            $("#layerButtons a").removeClass("activeButton");
            btnEl.addClass("activeButton");
        });
    },
    initMap: function () {
        "use strict";

        //set up map
        var map = L.mapbox.map('map', 'uknowho.map-wc8j7l0g')
            .setView([38.9, -77.02], 12);
            //heat = {}; // L.heatLayer(crimeData, {maxZoom: 18}).addTo(map);
        return map;
    },
    loadHeatMapLayer: function (m, crimeData) {
        "use strict";

        if (this.curHeatLayer) {
            this.map.removeLayer(this.curHeatLayer);
        }
        return L.heatLayer(crimeData, {
            maxZoom: 21,
            max: 0.7,
            radius: 30
        }).addTo(m);
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
        //this.curHeatLayer = this.loadHeatMapLayer(this.map, data);
        $("#progressContainer").css("display", "none");
        
        this.genMarkerLayer(data);
        
        //this.map.addLayer(layer);
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
    genMarkerLayer: function (data) {
        "use strict";
        
        var clusterGroup = L.markerClusterGroup();
        this.map.addLayer(clusterGroup);

        if (typeof(Worker) !== "undefined") {
            if (this.worker === null) {
                this.worker = new Worker("js/workers/genClusterLayer.js");
            }

            this.worker.onmessage = function (e) {
                var obj = e.data;
                if (obj.status === "loading") {
                    var idx, curCoord, curMarkers = [];

                    for (idx = 0; idx < obj.data.length; idx++) {
                        curCoord = obj.data[idx];
                        curMarkers.push(L.marker([curCoord[0], curCoord[1]]));
                    }
                    clusterGroup.addLayers(curMarkers);
                } else if (obj.status === "complete") {
                    alert("Loaded data!" + this);
                }
            }

            //pass in the Leaflet object to the worker
            this.worker.postMessage(data);
        } else {
            alert("Web workers aren't supported on your browser. No plotting for you!")
        }
    }

};

//on document ready
$(function () {
    "use strict";

    //initialize foundation
    $(document).foundation();

    App.initialize();
});
