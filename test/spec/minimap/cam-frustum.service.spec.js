'use strict';

describe('minimap.CamFrustumService', function() {

  // load the module
  beforeEach(module('pattyApp.minimap', 'mockedDrivemap'));

  var mockFrustum;

  var service;

  var ol;

  var customMatchers = {
    toBeCloseEnoughTo: function() {
      function arrayIsCloseEnough(inputArray1, inputArray2, maxDiff) {
        var result = true;
        if (inputArray1.length !== inputArray2.length) {
          return false;
        }

        for (var i = 0; i < inputArray1.length; i++) {
          if (inputArray1[i] instanceof Array) {
            if (inputArray2 instanceof Array) {
              result = arrayIsCloseEnough(inputArray1[i], inputArray2[i], maxDiff);
            } else {
              result = false;
            }
          } else {
            if (inputArray1[i] < inputArray2[i] - maxDiff || inputArray1[i] > inputArray2[i] + maxDiff) {
              result = false;
            }
          }
        }
        return result;
      }

      return {
        compare: function(actualArray, expectedArray) {
          var result = {};
          if (actualArray instanceof Array && expectedArray instanceof Array) {
            result.pass = arrayIsCloseEnough(actualArray, expectedArray, 0.0001);
            if (result.pass === false) {
              result.message = 'Expected ' + JSON.stringify(actualArray) + ' and ' + JSON.stringify(expectedArray) + ' to have the same elements. They did not.';
            }
          } else {
            result.pass = false;
            result.message = 'Expected ' + JSON.stringify(actualArray) + ' and ' + JSON.stringify(expectedArray) + ' to be an array. They were not.';
          }

          return result;
        }
      };
    }
  };

  beforeEach(function() {
    jasmine.addMatchers(customMatchers);
  });

  beforeEach(function() {
    inject(function($rootScope, DrivemapService, CamFrustumService, defaultDrivemapJSON, _ol_) {
      service = CamFrustumService;

      DrivemapService.onLoad(defaultDrivemapJSON);
      // promise.then are called in digest loop
      // minimap uses promise.then to fetch the crs of the drivemap
      $rootScope.$digest();

      ol = _ol_;
      mockFrustum = [{
        x: 267664.56118855654,
        y: 367057.2162330316
      }, {
        x: 50434.57857780314,
        y: 341598.10235807305
      }, {
        x: -405953.6735302854,
        y: 785493.5449968544
      }, {
        x: 777696.5008112825,
        y: 924216.0372352933
      }];
    });
  });

  describe('initial state', function() {
    it('should have a layer, which has class ol.layer.Base or subclass thereof', function() {
      expect(service.layer instanceof ol.layer.Layer).toBeTruthy();
    });

    it('should have a camFrustum, of class ol.geom.LineString or subclass thereof', function() {
      // expect(service.camFrustum).toBeDefined();
      expect(service.camFrustum instanceof ol.geom.LineString).toBeTruthy();
    });

    it('should have a camFrustum with initial coordinates', function() {
      expect(service.camFrustum.getCoordinates()).toEqual([
        [0, 0],
        [1, 0],
        [0, 1]
      ]);
    });
  });

  describe('onCameraMove() function', function() {
    it('should set coordinates for camFrustum', function() {
      var mockCamFrustumCoordinates = [
        [
          267664.56118855654,
          367057.2162330316
        ],
        [
          50434.57857780314,
          341598.10235807305
        ],
        [-405953.6735302854,
          785493.5449968544
        ],
        [
          777696.5008112825,
          924216.0372352933
        ],
        [
          267664.56118855654,
          367057.2162330316
        ]
      ];

      service.onCameraMove(mockFrustum, true);
      var expectedCoordinates = service.camFrustum.getCoordinates();

      expect(expectedCoordinates).toBeCloseEnoughTo(mockCamFrustumCoordinates);
    });
  });

  describe('getExtent() function', function() {
    it('should set coordinates for camFrustum', function() {
      service.onCameraMove(mockFrustum);
      var extent = service.getExtent();
      var expected = [-405953.6735302854,341598.10235807305,777696.5008112825,924216.0372352933];

      expect(extent).toBeCloseEnoughTo(expected);
    });
  });

  describe('getCameraPosition() function', function() {
    it('should return center of frustum', function() {
      service.onCameraMove(mockFrustum);

      var center = service.getCameraPosition();

      var expected = [159049.56988317985,354327.6592955523];
      expect(center).toBeCloseEnoughTo(expected);
    });
  });

});
