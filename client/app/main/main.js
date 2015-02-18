'use strict';

angular.module('dcCrimeHeatmapApp.mainModule', [
    'dcCrimeHeatmapApp.mainController'
])
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });
  });
