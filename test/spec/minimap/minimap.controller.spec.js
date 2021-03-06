'use strict';

describe('minimap.controller', function() {

  // load the module
  beforeEach(module('pattyApp.minimap', 'pattyApp.extract', 'mockedDrivemap'));

  var $controller;
  var $rootScope;
  var controller;
  var CamFrustumService;
  var MinimapExtractionSelectionService;
  var ol;

  beforeEach(function() {
    inject(function(_$controller_, _$rootScope_, DrivemapService, defaultDrivemapJSON, _CamFrustumService_, _ol_, _MinimapExtractionSelectionService_) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      ol = _ol_;

      var scope = $rootScope.$new();

      controller = $controller('MinimapController', {
        $scope: scope
      });

      DrivemapService.onLoad(defaultDrivemapJSON);
      // promise.then are called in digest loop
      // minimap uses promise.then to fetch the crs of the drivemap
      $rootScope.$digest();

      CamFrustumService = _CamFrustumService_;
      MinimapExtractionSelectionService = _MinimapExtractionSelectionService_;

      // size will undefined when map.setTarget() has not been called
      // so set size ourselves
      controller.map.setSize([290, 290]);
    });
  });

  describe('initial state', function() {
    it('should have a map of type ol.Map', function() {
      // expect(controller.map).toBeDefined();
      expect(controller.map instanceof ol.Map).toBeTruthy();
    });
    it('should have CamFrustumService.layer as a layer in the map', function() {
      expect(controller.map.getLayers().getArray()).toContain(CamFrustumService.layer);
    });
    it('should have a extraction selection layer in the map', function() {
      expect(controller.map.getLayers().getArray()).toContain(MinimapExtractionSelectionService.layer);
    });
  });

  describe('centerMap() function', function() {
    it('should center map', function() {
      spyOn(controller.map.getView(), 'setCenter');

      var center = [10, 20];
      controller.centerMap(center);

      expect(controller.map.getView().setCenter).toHaveBeenCalledWith(center);
    });
  });

  describe('updateFrustrumAndCenterMap() function', function() {
    beforeEach(function() {
      this.frustum = [{x:15, y:35}, {x:15, y:5}, {x:35, y:0}, {x:35, y:50}];
      controller.updateFrustrumAndCenterMap(null, this.frustum, true);
    });

    it('should update frustrum', function() {
      var pos = CamFrustumService.getCameraPosition();
      expect(pos[0]).toBeCloseTo(35, 2);
      expect(pos[1]).toBeCloseTo(25, 2);
    });

    it('should center map', function() {
      var pos = controller.map.getView().getCenter();
      expect(pos[0]).toBeCloseTo(35, 2);
      expect(pos[1]).toBeCloseTo(25, 2);
    });
  });

});
