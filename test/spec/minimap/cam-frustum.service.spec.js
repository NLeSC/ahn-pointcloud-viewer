'use strict';

describe('minimap.CamFrustumService', function() {

  // load the module
  beforeEach(module('pattyApp.minimap', 'mockedDrivemap'));

  var mockFrustum;

  var service;

  var ol;

  beforeEach(function() {
    inject(function($rootScope, DrivemapService, CamFrustumService, defaultDrivemapJSON, _ol_) {
      service = CamFrustumService;

      DrivemapService.onLoad(defaultDrivemapJSON);
      // promise.then are called in digest loop
      // minimap uses promise.then to fetch the crs of the drivemap
      $rootScope.$digest();

      ol = _ol_;
      mockFrustum = {'cam':{'x':93938.7265625,'y':436669.46875,'z':149.99999999990305},'left':{'x':93440.63638977098,'y':436964.9426789419,'z':149.999999999903},'right':{'x':94431.34984060985,'y':436973.96993015846,'z':149.999999999903}};
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

    it('should have a camFrustum with coordinates [[0,0],[0,0]]', function() {
      // expect(service.camFrustum).toBeDefined();
      expect(service.camFrustum.getCoordinates()).toEqual([[0,0],[0,0]]);
    });
  });

  describe('onCameraMove() function', function() {
    it('should set coordinates for camFrustum', function() {
      var mockCamFrustumCoordinates = [[93938.7265625, 436669.4687500017],[93440.63638977094, 436964.9426789425],[94431.34984060988, 436973.96993015957],[93938.7265625, 436669.4687500017]];

      service.onCameraMove(mockFrustum);
      var expectedCoordinates = service.camFrustum.getCoordinates();

      expect(expectedCoordinates).toEqual(mockCamFrustumCoordinates);
    });
  });

  describe('getExtent() function', function() {
    it('should set coordinates for camFrustum', function() {
      service.onCameraMove(mockFrustum);
      var extent = service.getExtent();
      var expected = [93440.63638977094, 436669.4687500017, 94431.34984060988, 436973.96993015957];

      expect(extent).toEqual(expected);
    });
  });

});
