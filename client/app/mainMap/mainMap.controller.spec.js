'use strict';

describe('Controller: MainMapCtrl', function () {

  // load the controller's module
  beforeEach(module('dcCrimeHeatMapApp.mainMap.ctrl'));

  var MainMapCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainMapCtrl = $controller('MainMapCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
