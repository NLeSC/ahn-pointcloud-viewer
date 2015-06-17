(function() {
  'use strict';

  function SettingsController(PointcloudService, CameraService, MeasuringService) {
    this.showSettings = false;
    this.settings = PointcloudService.settings;
    this.PointcloudService = PointcloudService;
    this.measure = MeasuringService;

    this.recordCameraLocation = function() {
      CameraService.recordLocation();
    };
  }

  angular.module('pattyApp.settings').controller('SettingsController', SettingsController);
})();
