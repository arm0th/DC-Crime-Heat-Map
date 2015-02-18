/*global angular, $, TweenMax */
(function () {
    'use strict';

    angular.module('dcCrimeHeatmapApp.legend', [])
        .directive('legend', function () {
            return {
                restrict: 'EA',
                scope: {
                    crimeTotals: '=totals',
                    legendState: '=state'
                },
                templateUrl: 'app/legend/legend.html',
                link: function (scope, element, attrs) {
                    $("#legendToggleBtn").click(function () {
                        var mapLegend = $("#mapLegend"),
                            curPos = mapLegend.css("bottom"),
                            contentHeight = $("#crimeTotals").outerHeight();

                        TweenMax.to(mapLegend, 0.5, {
                            bottom: (curPos === "0px") ? -contentHeight : "0px"
                        });
                    });
                }
            };
        });
}());
