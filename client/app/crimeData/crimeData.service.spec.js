'use strict';

describe('Service: crimeData', function () {

  // load the service's module
  beforeEach(function () {
      module('dcCrimeHeatmapApp.crimeDataFactory');
      inject(function (_crimeData_) {
        crimeData = _crimeData_;
      });
  });

  // instantiate service
  var crimeData;

  it('should do something', function () {
    expect(!!crimeData).to.equal(true);
  });

});
