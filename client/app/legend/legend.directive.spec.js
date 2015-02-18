'use strict';

describe('Directive: legend', function () {

  // load the directive's module and view
  beforeEach(module('dcCrimeHeatMapApp'));
  beforeEach(module('app/legend/legend.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<legend></legend>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the legend directive');
  }));
});