'use strict';

describe('Controller: MainCtrl', function () {

  var MainCtrl,
      scope,
      $httpBackend;

  // load the controller's module
  beforeEach(function () {
      module('dcCrimeHeatmapApp.modalComponent');
      module('dcCrimeHeatmapApp.mainController');
      module('socketMock');

      // Initialize the controller and a mock scope
      inject(function (_$httpBackend_, $controller, $rootScope) {
        $httpBackend = _$httpBackend_;

        scope = $rootScope.$new();
        MainCtrl = $controller('MainCtrl', {
          $scope: scope
        });

        $httpBackend.expectGET('/api/things')
          .respond(['HTML5 Boilerplate', 'AngularJS', 'Karma', 'Express']);

      });

  });



  it('should attach a list of things to the scope', function () {
    //$httpBackend.flush();
    expect(scope.status.progress).toBe(0);
  });
});
