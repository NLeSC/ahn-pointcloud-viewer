'use strict';

describe('extract.ExtractionSelectionService', function() {
  // load the module
  beforeEach(module('pattyApp.extract'));

  beforeEach(inject(function (ExtractionSelectionService) {
    this.selection = ExtractionSelectionService;
  }));

  describe('toRequest() function', function() {
    it('should return a request with min/max in right order', function() {
      var request = this.selection.toRequest();

      var expected = {
        left: 93720.22,
        bottom: 436899.97,
        right: 94428.37,
        top: 438334.32
      };
      expect(request).toEqual(expected);
    });

    it('should swap right/left when lon1>lon2', function() {
      this.selection.lon1 = 10;
      this.selection.lon2 = 5;
      var request = this.selection.toRequest();

      var expected = {
        left: 5,
        bottom: 436899.97,
        right: 10,
        top: 438334.32
      };
      expect(request).toEqual(expected);
    });

    it('should swap bottom/top when lat1>lat2', function() {
      this.selection.lat1 = 10;
      this.selection.lat2 = 5;
      var request = this.selection.toRequest();

      var expected = {
        left: 93720.22,
        bottom: 5,
        right: 94428.37,
        top: 10
      };
      expect(request).toEqual(expected);
    });
  });
});
