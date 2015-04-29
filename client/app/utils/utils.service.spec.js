'use strict';

describe('Service: utils', function () {

  // load the service's module
  beforeEach(module('dcCrimeHeatmapApp.utils'));

  // instantiate service
  var utils;
  beforeEach(inject(function (_utils_) {
    utils = _utils_;
  }));

  it('should define capitalizeStr', function () {
    expect(utils.capitalizeStr).to.be.defined;
  });

});
