'use strict';

describe('searchbox.controller', function() {

  // load the module
  beforeEach(module('pattyApp.searchbox'));
  beforeEach(module('mockedSites'));

  var ctrl;
  var PointcloudService;
  var SitesService;
  var site162 = null;

  beforeEach(function() {
    inject(function(_$controller_, _PointcloudService_, _SitesService_, defaultSitesJSON) {
      PointcloudService = _PointcloudService_;
      SitesService = _SitesService_;
      site162 = defaultSitesJSON[0];
      var $controller = _$controller_;
      ctrl = $controller('SearchPanelController');
    });
  });

  describe('initial state', function() {
    it('should have empty query', function() {
      expect(ctrl.SitesService.query).toEqual('');
    });

    it('should have currentPage equal to 1', function() {
      expect(ctrl.currentPage).toEqual(1);
    });

    it('should have currentSite equal to null', function() {
      expect(ctrl.currentSite).toEqual(null);
    });

    it('should have disabledButtons', function() {
      var db = {
        sitePc: true,
        siteMesh: true
      };
      expect(ctrl.disabledButtons).toEqual(db);
    });
  });

  describe('currentSite setter', function(){
    it('should set currentSite', function(){
      ctrl.currentSite = site162;

      expect(ctrl.currentSite).toEqual(site162);
    });
  });

  describe('onQueryChange function', function() {
    it('should set currentPage equal to 1', function() {
      ctrl.currentPage = 234;
      ctrl.onQueryChange();
      expect(ctrl.currentPage).toEqual(1);
    });
  });

  describe('lookAtSite function', function() {
    it('should call lookAtSite() on PointcloudService', function() {
      spyOn(PointcloudService, 'lookAtSite');

      ctrl.lookAtSite('somequery');

      expect(PointcloudService.lookAtSite).toHaveBeenCalledWith('somequery');
    });
  });

  describe('showLabel function', function() {
    it('should call showLabel() on PointcloudService', function() {
      spyOn(PointcloudService, 'showLabel');

      ctrl.showLabel(site162);

      expect(PointcloudService.showLabel).toHaveBeenCalledWith(site162);
    });
  });

  describe('enterOrbitMode function', function() {
    it('should call enterOrbitMode() on PointcloudService', function() {
      spyOn(PointcloudService, 'enterOrbitMode');

      ctrl.enterOrbitMode(site162);

      expect(PointcloudService.enterOrbitMode).toHaveBeenCalledWith('event', site162);
    });
  });

});
