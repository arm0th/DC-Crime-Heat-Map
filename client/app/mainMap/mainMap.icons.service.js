/*global angular, L */
(function () {
    'use strict';

    angular.module('dcCrimeHeatmapApp.mainMap.icons', [])
        .factory('IconFactory', function () {
            return {
                iconURLs: {
                    RedIcon: '../assets/images/marker-icon-red.png',
                    TheftIcon: '../assets/images/theft.png',
                    HomicideIcon: '../assets/images/homicide.png',
                    CarIcon: '../assets/images/car.png',
                    RobberyIcon: '../assets/images/robbery.png',
                    SexAssultIcon: '../assets/images/sex_assult.png'
                },
                icons: {
                    RedIcon: L.Icon.Default.extend({
                        options: {
                            iconUrl: '../assets/images/marker-icon-red.png'
                        }
                    }),
                    TheftIcon: L.Icon.Default.extend({
                        options: {
                            iconSize: [30, 30],
                            iconAnchor: [15, 30],
                            iconUrl: '../assets/images/theft.png'
                        }
                    }),
                    HomicideIcon: L.Icon.Default.extend({
                        options: {
                            iconSize: [30, 30],
                            iconAnchor: [15, 30],
                            iconUrl: '../assets/images/homicide.png'
                        }
                    }),
                    CarIcon: L.Icon.Default.extend({
                        options: {
                            iconSize: [30, 30],
                            iconAnchor: [15, 30],
                            iconUrl: '../assets/images/car.png'
                        }
                    }),
                    RobberyIcon: L.Icon.Default.extend({
                        options: {
                            iconSize: [30, 30],
                            iconAnchor: [15, 30],
                            iconUrl: '../assets/images/robbery.png'
                        }
                    }),
                    SexAssultIcon: L.Icon.Default.extend({
                        options: {
                            iconSize: [30, 30],
                            iconAnchor: [15, 30],
                            iconUrl: '../assets/images/sex_assult.png'
                        }
                    })

                },
                getIconKey: function (offenseType) {
                    var iconKey;

                    if (offenseType.match(/HOMICIDE/i)) {
                        iconKey = "HomicideIcon";
                    } else if (offenseType.match(/MOTOR VEHICLE/i) || offenseType.match(/STOLEN AUTO/i)) {
                        iconKey = "CarIcon";
                    } else if (offenseType.match(/[\w\W]*THEFT[\w\W]*/i)) {
                        iconKey = "TheftIcon";
                    } else if (offenseType.match(/ROBBERY/i)) {
                        iconKey = "RobberyIcon";
                    } else if (offenseType.match(/SEX[\w\W]*/i)) {
                        iconKey = "SexAssultIcon";
                    } else {
                        iconKey = "RedIcon";
                    }

                    return iconKey;
                },
                getIconPath: function (offenseType) {
                    var iconKey = this.getIconKey(offenseType);

                    //return relative URL path based off of iconKey
                    return this.iconURLs[iconKey];
                },
                genIcon: function (offenseType) {
                    var iconKey = this.getIconKey(offenseType);

                    //instanciate icon and return it
                    return new this.icons[iconKey]();
                }
            };
        });
}());
