'use strict';

describe('Directive: mainMap', function () {

  // load the directive's module and view
  beforeEach(function () {
      module('dcCrimeHeatmapApp.mainController');
      module('app/mainMap/mainMap.html');
      module('dcCrimeHeatmapApp.mainMap');
  });

  var element, scope, $compile;

  beforeEach(inject(function ($rootScope, _$compile_) {
    scope = $rootScope.$new();
    $compile = _$compile_;
  }));

//  it('should make hidden element visible', function () {
//    element = angular.element('<main-map></main-map>');
//    element = $compile(element)(scope);
//    scope.$digest();
//    //expect(element.text()).toBe('this is the mainMap directive');
//  });
});
