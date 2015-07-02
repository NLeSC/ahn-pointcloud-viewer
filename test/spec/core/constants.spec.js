'use strict';

describe('core.constants', function() {

  // load the module
  beforeEach(module('pattyApp.core'));

  it('should have proj4 defined', inject(function(_proj4_) {
      expect(_proj4_).toBeDefined();
  }));

  it('should have ol defined', inject(function(_ol_) {
      expect(_ol_).toBeDefined();
  }));

  describe('pattyConf constant', function() {
    var pattyConf;

    beforeEach(inject(function(_pattyConf_) {
      pattyConf = _pattyConf_;
    }));

    it('should have a DRIVEMAP_JSON_URL key', function() {
      expect(pattyConf.DRIVEMAP_JSON_URL).toBeDefined();
    });

    it('should have a AHN_API_ENDPOINT key', function() {
      expect(pattyConf.AHN_API_ENDPOINT).toBeDefined();
    });

  });
});
