(function() {
  'use strict';

  function SearchPanelController(PointcloudService, Messagebus) {
    this.pageSize = 2;
    this.currentPage = 1;
    this.Messagebus = Messagebus;

    var _currentSite = null;
    Object.defineProperty(this, 'currentSite', {
      get: function() {
        return _currentSite;
      },
      set: function(site) {
        _currentSite = site;
        this.toggleButtons.sitePc = PointcloudService.sitePointcloudId === site.id;
      },
      enumerable: true,
      configurable: true
    });

    this.disabledButtons = {
      sitePc: true,
      siteMesh: true
    };

    this.toggleButtons = {
      _sitePc: false,
      _driveMap: true,
      _siteMesh: false
    };

    Object.defineProperties(this.toggleButtons, {
      sitePc: {
        get: function() {
          return this._sitePc;
        },
        set: function(bool) {
          this._sitePc = bool;
          if(bool){
            PointcloudService.loadSite(_currentSite);
          } else {
            PointcloudService.removeSitePointcloud();
          }
        },
        enumerable: true,
        configurable: true
      },
      driveMap: {
        get: function() {
          return this._driveMap;
        },
        set: function(bool) {
          this._driveMap = bool;
          if(bool){
            PointcloudService.enableDrivemap();
          } else {
            PointcloudService.disableDrivemap();
          }
        },
        enumerable: true,
        configurable: true
      },
      siteMesh: {
        get: function() {
          return this._siteMesh;
        },
        set: function(bool) {
          this._siteMesh = bool;
          if(bool){
            PointcloudService.enableSiteMesh();
          } else {
            PointcloudService.disableSiteMesh();
          }
        },
        enumerable: true,
        configurable: true
      }
    });

    Messagebus.subscribe('singleSite', function(event, site){
        this.currentSite = site;
        this.disabledButtons.sitePc = !('pointcloud' in site);
        //this.disabledButtons.siteMesh = !('mesh' in site);
    }.bind(this));

    this.lookAtSite = function(site) {
      PointcloudService.lookAtSite(site);
    };
    this.showLabel = function(site) {
      PointcloudService.showLabel(site);
    };
    this.enterOrbitMode = function(site) {
      PointcloudService.enterOrbitMode('event', site);
    };
    /**
     * jump back to first page when query changes
     */
    this.onQueryChange = function() {
      this.currentPage = 1;
    };

  }

  angular.module('pattyApp.searchbox')
    .controller('SearchPanelController', SearchPanelController);
})();
