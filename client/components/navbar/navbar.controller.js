/*global angular */
(function () {
    "use strict";

    function NavBarController($scope, $location, crimeYears) {
        $scope.menu = [{
            'title': 'Home',
            'link': '/'
        }];

        $scope.yearsData = crimeYears.yearsData;

        $scope.isCollapsed = true;

        $scope.isActive = function (route) {
            return route === $location.path();
        };

        $scope.toggled = function (data) {
            alert("data:" + data);
        };
    }

    angular.module('dcCrimeHeatmapApp')
        .controller('NavbarCtrl', NavBarController);

}());
