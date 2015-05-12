'use strict';

describe('Service: dfapi', function () {

  // load the service's module
  beforeEach(module('angularjsAuthTutorialApp'));

  // instantiate service
  var dfapi;
  beforeEach(inject(function (_dfapi_) {
    dfapi = _dfapi_;
  }));

  it('should do something', function () {
    expect(!!dfapi).toBe(true);
  });

});
