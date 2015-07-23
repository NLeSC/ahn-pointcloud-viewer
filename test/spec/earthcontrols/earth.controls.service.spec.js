'use strict';

describe('earthcontrols.service', function() {
  // load the module
  beforeEach(module('pattyApp.earthcontrols'));

  var service;
  var msgbus;
  var THREE;
  var PathControls;

  beforeEach(function() {
    inject(function(_EarthcontrolsService_, _Messagebus_, _THREE_, _PathControls_) {
      service = _EarthcontrolsService_;
      msgbus = _Messagebus_;
      THREE = _THREE_;
      PathControls = _PathControls_;
    });
  });

  it('should initially be turned on', function() {
    expect(service.enabled).toBeTruthy();
  });
});
