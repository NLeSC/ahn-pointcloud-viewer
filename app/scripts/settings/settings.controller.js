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

    this.ld = false;
    this.sd = true;
    this.md = false;
    this.hd = false;

    this.settingsChanged = function() {
      this.ld = false;
      this.sd = false;
      this.md = false;
      this.hd = false;
      if (this.PointcloudService.settings === this.PointcloudService.predefinedSettings.LOW) {
        this.ld=true;
      } else if (this.PointcloudService.settings === this.PointcloudService.predefinedSettings.STANDARD) {
        this.sd=true;
      } else if (this.PointcloudService.settings === this.PointcloudService.predefinedSettings.HIGH) {
        this.md=true;
      } else if (this.PointcloudService.settings === this.PointcloudService.predefinedSettings.ULTRA) {
        this.hd=true;
      }
    }.bind(this);
  }

  angular.module('pattyApp.settings').controller('SettingsController', SettingsController);
})();
