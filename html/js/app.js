/*global document*/
var App = {
    map: null,
    curHeatLayer: null,
    initialize: function () {
             
        //download all heatmap data
        this.downloadData();
        this.map = this.initMap();
    },
    initMap: function () {
        //set up map
        var map = L.mapbox.map('map', 'uknowho.map-wc8j7l0g')
            .setView([38.9, -77.02], 12);
            //heat = {}; // L.heatLayer(crimeData, {maxZoom: 18}).addTo(map);
        return map;
    },
    loadHeatMapLayer: function (m, crimeData) {
        return L.heatLayer(crimeData, {maxZoom: 20}).addTo(m);
    },
    dataURLs: [
        { id: "crimeData2011", src: "js/crimeDataCoords_2011.json" },
        { id: "crimeData2012", src: "js/crimeDataCoords_2012.json" },
        { id: "crimeData2013", src: "js/crimeDataCoords_2013.json" }
    ],
    downloadQueue: {},
    downloadCompleteHandler: function () {
        var data = this.downloadQueue.getResult("crimeData2013");
        this.curHeatLayer = this.loadHeatMapLayer(this.map, data);
    },
    downloadData: function () {
        this.downloadQueue = new createjs.LoadQueue();
        var queue = this.downloadQueue;

        queue.on("complete", this.downloadCompleteHandler, this);
        queue.on("error", function (e) {
            alert("Failed to load crime data");
        });
        queue.on("fileload", function (e) {
            //TODO: do we need to do something after something loads?
        });
        queue.loadManifest(this.dataURLs);
    }

};

//on document ready
$(function() {
    App.initialize();

    //initialize foundation
    $(document).foundation();
});
