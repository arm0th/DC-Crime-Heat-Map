/*global angular */
(function () {
    'use strict';

    angular.module('dcCrimeHeatmapApp.legend', [])
        .directive('legend', function () {
            return {
                restrict: 'EA',
                scope: {
                    crimeTotals: '=totals'
                },
                templateUrl: 'app/legend/legend.html',
                link: function (scope, element, attrs) {

                }
            };
        });
}());
