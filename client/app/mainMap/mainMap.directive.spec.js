'use strict';

describe('Directive: mainMap', function () {

  // load the directive's module and view
  beforeEach(function () {
      module('app/mainMap/mainMap.html');
      module('dcCrimeHeatmapApp.mainMap');

      inject(function ($rootScope) {
        scope = $rootScope.$new();
      });
  });

  var element, scope;

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<main-map></main-map>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the mainMap directive');
  }));
});
