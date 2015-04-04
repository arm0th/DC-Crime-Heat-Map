'use strict';

describe('Directive: legend', function () {

  // load the directive's module and view
  beforeEach(function () {
      module('dcCrimeHeatmapApp.legend');
      module('app/legend/legend.html');

      inject(function ($rootScope) {
        scope = $rootScope.$new();
      });
  });


  var element, scope;


  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<legend></legend>');
    element = $compile(element)(scope);
    scope.$apply();
    //expect(element.text()).toBe('this is the legend directive');
  }));
});
