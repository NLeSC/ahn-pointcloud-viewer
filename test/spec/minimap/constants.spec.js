'use strict';

describe('minimap.constants', function() {

  // load the module
  beforeEach(module('pattyApp.minimap'));

  it('should have ol defined', inject(function(_ol_) {
      expect(_ol_).toBeDefined();
  }));
});
