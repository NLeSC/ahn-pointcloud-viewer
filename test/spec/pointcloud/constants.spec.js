'use strict';

describe('pointcloud.constants', function() {

  // load the module
  beforeEach(module('pattyApp.pointcloud'));

  it('should have THREE defined', inject(function(_THREE_) {
      expect(_THREE_).toBeDefined();
  }));

  it('should have POCLoader defined', inject(function(_POCLoader_) {
      expect(_POCLoader_).toBeDefined();
  }));

  it('should have Potree defined', inject(function(_Potree_) {
      expect(_Potree_).toBeDefined();
  }));
});
