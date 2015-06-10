(function() {
  'use strict';

  function SearchPanelController(PointcloudService, Messagebus) {
    this.pageSize = 2;
    this.currentPage = 1;
    this.Messagebus = Messagebus;

    this.disabledButtons = {
    };

    this.toggleButtons = {
      _driveMap: true
    };

    Object.defineProperties(this.toggleButtons, {
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
      }
    });

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
