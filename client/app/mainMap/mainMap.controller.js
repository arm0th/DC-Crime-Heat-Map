/*global angular */
(function () {
    'use strict';

    angular.module('dcCrimeHeatMapApp.mainMap.ctrl', [])
        .controller('MainMapCtrl', function ($scope) {
            var ctrl = this;

            ctrl.config = {
                minZoom: 11,
                startZoom: 12,
                maxZoom: 19,
                startCoords: [38.9, -77.02]
            };
        });
}());
