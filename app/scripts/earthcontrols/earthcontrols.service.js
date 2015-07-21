(function() {
  'use strict';

  function EarthControlsService(Messagebus) {
    this.enabled = false;

    Messagebus.subscribe('earthcontrols enabled', function(event, value) {

    });
  }

  angular.module('pattyApp.earthcontrols').service('EarthControlsService', EarthControlsService);
})();
