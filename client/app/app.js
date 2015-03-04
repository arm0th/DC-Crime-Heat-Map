/*jslint plusplus: true, nomen: true */
/*global angular */
(function () {
    'use strict';

    var app = angular.module('dcCrimeHeatmapApp', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'btford.socket-io',
        'ui.router',
        'ui.bootstrap',
        'dcCrimeHeatmapApp.mainModule',
        'dcCrimeHeatmapApp.crimeDataFactory',
        'dcCrimeHeatmapApp.navBarComponent',
        'dcCrimeHeatmapApp.socketComponent'
    ]);
    app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $urlRouterProvider
            .otherwise('/');
        $locationProvider.html5Mode(true);
    });

}());
