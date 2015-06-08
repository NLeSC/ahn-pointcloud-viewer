(function() {
  'use strict';

  function CameramodesController($rootScope, PathControls, Messagebus) {
    this.PathControls = PathControls;
    this.cameraMode = PathControls.mode;
    this.orbitModeEnabled = false;

    Messagebus.subscribe('orbitModeEnabled', function(event, value) {
      this.orbitModeEnabled = value;
      if (value) {
        if (!$rootScope.$$phase) {
          $rootScope.$apply();
        }
      }
    }.bind(this));

    this.exitOrbitMode = function() {
      Messagebus.publish('exitOrbitMode');
    };
  }

  angular.module('pattyApp.cameramodes')
    .controller('CameramodesController', CameramodesController);
})();
