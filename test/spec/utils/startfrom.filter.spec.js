'use strict';

describe('utils.startfrom', function() {

  // load the module
  beforeEach(module('pattyApp.utils'));

  var startFromFilter;
  beforeEach(function() {
    inject(function(_startFromFilter_) {
      startFromFilter = _startFromFilter_;
    });
  });

  it('should slice input', function() {
    var result = startFromFilter(['a', 'b'], 1);
    expect(result).toEqual(['b']);
  });

});
