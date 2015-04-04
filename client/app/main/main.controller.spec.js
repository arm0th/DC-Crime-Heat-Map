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



  it('should define a status object', function () {
    //$httpBackend.flush();
    expect(scope.status).toEqual(jasmine.any(Object));
    expect(scope.legendState).toEqual(jasmine.any(Object));
  });

  it('should define a legendState object', function () {
    expect(scope.legendState).toEqual(jasmine.any(Object));
  });

});
