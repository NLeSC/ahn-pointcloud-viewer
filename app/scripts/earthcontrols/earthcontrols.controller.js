(function() {
  'use strict';

  function EarthcontrolsController(Messagebus) {
    this.enabled = false;

    this.toggleEarthcontrols = function() {
      this.enabled = !this.enabled;
      Messagebus.publish('earthcontrols enabled', this.enabled);
    };
  }

  angular.module('pattyApp.earthcontrols')
    .controller('EarthcontrolsController', EarthcontrolsController);
})();
