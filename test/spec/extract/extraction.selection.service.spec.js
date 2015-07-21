'use strict';

describe('extract.ExtractionSelectionService', function() {
  // load the module
  beforeEach(module('pattyApp.extract'));

  var $timeout;
  var $rootScope;

  beforeEach(inject(function (ExtractionSelectionService, $injector) {
    $timeout = $injector.get('$timeout');
    $rootScope = $injector.get('$rootScope');

    this.selection = ExtractionSelectionService;
  }));

  describe('toRequest() function', function() {
    it('should return a request with min/max in right order', function() {
      var expected = {
        left: 93720.22,
        bottom: 436899.97,
        right: 94428.37,
        top: 438334.32
      };

      var request = this.selection.toRequest();
      expect(request).toEqual(expected);
    });

    it('should swap right/left when left>right', function() {
      this.selection.left = 10;
      this.selection.right = 5;

      $timeout.flush();

      var expected = {
        left: 5,
        bottom: 436899.97,
        right: 10,
        top: 438334.32
      };

      var request = this.selection.toRequest();
      expect(request).toEqual(expected);
    });

    it('should swap bottom/top when bottom>top', function() {
      this.selection.bottom = 10;
      this.selection.top = 5;

      $timeout.flush();

      var expected = {
        left: 93720.22,
        bottom: 5,
        right: 94428.37,
        top: 10
      };

      var request = this.selection.toRequest();
      expect(request).toEqual(expected);

    });
  });

  describe('setBottomLeftCoordinates() function', function() {
    it('Should set the bottom and left points to the requested coordinates', function() {
      this.selection.setBottomLeftCoordinates({lat:10,lon:20});

      $timeout.flush();

      var expected = {
        left: 20,
        bottom: 10,
        right: 94428.37,
        top: 438334.32
      };

      var request = this.selection.toRequest();
      expect(request).toEqual(expected);
    });

    it('should swap left/right and top/bottom when the new coordinates are larger than the top/right coordinates', function() {
      this.selection.setBottomLeftCoordinates({lat:800000,lon:100000});

      $timeout.flush();

      var expected = {
        left: 94428.37,
        bottom: 438334.32,
        right: 100000,
        top:800000
      };

      var request = this.selection.toRequest();
      expect(request).toEqual(expected);
    });
  });

  describe('setTopRightCoordinates() function', function() {
    it('Should set the right and top points to the requested coordinates', function() {
      this.selection.setTopRightCoordinates({lat:800000,lon:100000});

      $timeout.flush();

      var expected = {
        left: 93720.22,
        bottom: 436899.97,
        right: 100000,
        top: 800000
      };

      var request = this.selection.toRequest();
      expect(request).toEqual(expected);
    });

    it('should swap left/right and top/bottom when the new coordinates are smaller than the left/bottom coordinates', function() {
      this.selection.setTopRightCoordinates({lat:10,lon:20});

      $timeout.flush();

      var expected = {
        left: 20,
        bottom: 10,
        right: 93720.22,
        top: 436899.97
      };

      var request = this.selection.toRequest();
      expect(request).toEqual(expected);
    });
  });

  afterEach(function() {
    $timeout.verifyNoPendingTasks();
  });
});
