/*global document*/
var App = {
    map: null,
    curHeatLayer: null,
    initialize: function () {
        var self = this;
             
        //download all heatmap data
        this.downloadQueue = this.downloadData();

        this.map = this.initMap();

        $("#yearDropItems").click(function (e) {
            var newYear = e.target.innerText;

            var data = self.downloadQueue.getResult("crimeData" + newYear);
            self.curHeatLayer = self.loadHeatMapLayer(self.map, data);
            //alert("we got something: " + newYear);
            //NOTE: this refers to the dropdown
            $("#yearDropBtn").text("Crime for " + newYear);
            $(this).removeClass("open"); //hides the dropdown
            this.style.left = "-999999px"; //TODO: find a better way!
        });
    },
    initMap: function () {
        //set up map
        var map = L.mapbox.map('map', 'uknowho.map-wc8j7l0g')
            .setView([38.9, -77.02], 12);
            //heat = {}; // L.heatLayer(crimeData, {maxZoom: 18}).addTo(map);
        return map;
    },
    loadHeatMapLayer: function (m, crimeData) {
        if (this.curHeatLayer) {
            this.map.removeLayer(this.curHeatLayer);
        }
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
        var queue = new createjs.LoadQueue();

        queue.on("complete", this.downloadCompleteHandler, this);
        queue.on("error", function (e) {
            alert("Failed to load crime data");
        });
        queue.on("fileload", function (e) {
            //TODO: do we need to do something after something loads?
        });
        queue.loadManifest(this.dataURLs);

        return queue;
    }

};

//on document ready
$(function() {
    //initialize foundation
    $(document).foundation();

    App.initialize();
});