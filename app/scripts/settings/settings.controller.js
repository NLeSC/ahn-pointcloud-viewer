(function() {
  'use strict';

  function SettingsController(PointcloudService, MeasuringService, PathControls, RailService) {
    this.showSettings = false;
    // this.predefinedSettings = PointcloudService.predefinedSettings;
    // this.settings = PointcloudService.settings;
    this.PointcloudService = PointcloudService;
    this.PathControls = PathControls;
    this.RailService = RailService;
    this.measure = MeasuringService;
  }

  angular.module('pattyApp.settings').controller('SettingsController', SettingsController);
})();
