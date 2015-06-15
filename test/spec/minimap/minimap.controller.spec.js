'use strict';

describe('minimap.controller', function() {

  // load the module
  beforeEach(module('pattyApp.minimap', 'mockedDrivemap'));

  var $controller;
  var $rootScope;
  var controller;
  var CamFrustumService;
  var ol;

  beforeEach(function() {
    inject(function(_$controller_, _$rootScope_, DrivemapService, defaultDrivemapJSON, _CamFrustumService_, _ol_) {
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
  });
});
