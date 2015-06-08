'use strict';

describe('minimap.controller', function() {

  // load the module
  beforeEach(module('pattyApp.minimap', 'mockedSites', 'mockedDrivemap'));

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

  describe('sites2GeoJSON() function', function() {
    it('should add 2 sites as features to map', inject(function(defaultSitesJSON, defaultSitesGeoJSON) {
      var result = controller.sites2GeoJSON(defaultSitesJSON);
      expect(result).toEqual(defaultSitesGeoJSON);
    }));
  });

  describe('onSitesChanged() function', function() {
    it('should fit map to show all newly filtered sites', inject(function(defaultSitesJSON) {
      controller.onSitesChanged(defaultSitesJSON);
      var result = controller.map.getView().calculateExtent(controller.map.getSize());
      var expected = [1396623.9840759311, 5135377.928591345, 1396710.5728970354, 5135464.517412449];
      expect(result).toEqual(expected);
    }));
  });

  describe('fitMapToExtent() function', function() {
    it('should fit map to given extent (not an exact resize due to integer zoom-levels)', function() {
      var extent = [1396655.7426223664, 5135386.69290534, 1396678.8143506004, 5135455.753098455];
      controller.fitMapToExtent(extent);
      var result = controller.map.getView().calculateExtent([290, 290]);
      var expected = [1396623.9840759311, 5135377.928591345, 1396710.5728970354, 5135464.517412449];
      expect(result).toEqual(expected);
    });
  });

  describe('onFeatureClick() function', function() {
    var SitesService;
    beforeEach(inject(function(_SitesService_, defaultSitesJSON) {
      SitesService = _SitesService_;
      SitesService.onLoad(defaultSitesJSON);
    }));

    it('should select site', function() {
      // stub for event.target.item(0).getId()
      var event = {
        target: {
          item: function() {
            return {
              getId: function() {
                return 162;
              }
            };
          }
        }
      };

      controller.onFeatureClick(event);

      expect(SitesService.query).toEqual('site:162');
    });
  });

  describe('onSiteHover() function', function() {
    it('should have site as text', function() {
      var feature = {
        getId: function() { return 162; }
      };

      var result = controller.onSiteHover(feature);

      expect(result[0].getText().getText()).toEqual('162');
    });
  });
});
