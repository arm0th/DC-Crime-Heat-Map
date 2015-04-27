/*global angular */
(function () {
    'use strict';

    angular.module('dcCrimeHeatMapApp')
        .factory('utils', function () {
            // Service logic
            // ...

            var meaningOfLife = 42;

            // Public API here
            return {
                someMethod: function () {
                    return meaningOfLife;
                }
            };
        });
}());
