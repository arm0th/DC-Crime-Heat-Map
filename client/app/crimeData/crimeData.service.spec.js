'use strict';

describe('Service: crimeYears', function () {

  // load the service's module
  beforeEach(module('dcCrimeHeatMapApp'));

  // instantiate service
  var crimeYears;
  beforeEach(inject(function (_crimeYears_) {
    crimeYears = _crimeYears_;
  }));

  it('should do something', function () {
    expect(!!crimeYears).toBe(true);
  });

});
