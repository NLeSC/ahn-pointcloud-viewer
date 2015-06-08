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

      mockFrustum = {'cam':{'x':297051.4777832031,'y':4632724.935546875,'z':141.26402282611974},'left':{'x':297406.5820811396,'y':4632622.404538055,'z':146.29805584894072},'right':{'x':297066.8933021421,'y':4632355.646999936,'z':146.29805584894078}};
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
      var mockCamFrustumCoordinates = [[1397771.4318921762,5134117.448713819],[1398250.8778260758,5133993.199513802],[1397806.1460583345,5133621.6601744285],[1397771.4318921762,5134117.448713819]];

      service.onCameraMove(mockFrustum);
      var expectedCoordinates = service.camFrustum.getCoordinates();

      expect(expectedCoordinates).toEqual(mockCamFrustumCoordinates);
    });
  });

  describe('getExtent() function', function() {
    it('should set coordinates for camFrustum', function() {
      service.onCameraMove(mockFrustum);

      var extent = service.getExtent();
      var expected = [1397771.4318921762, 5133621.6601744285, 1398250.8778260758, 5134117.448713819];

      expect(extent).toEqual(expected);
    });
  });

});
