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

    this.settingsChanged = function() {
      this.sd = false;
      this.md = false;
      this.hd = false;
      if (this.PointcloudService.settings === this.PointcloudService.predefinedSettings.LOW) {
        this.sd=true;
      } else if (this.PointcloudService.settings === this.PointcloudService.predefinedSettings.MEDIUM) {
        this.md=true;
      } else if (this.PointcloudService.settings === this.PointcloudService.predefinedSettings.HIGH) {
        this.hd=true;
      }
    }.bind(this);


    this.sd = true;
    this.md = false;
    this.hd = false;
  }

  angular.module('pattyApp.settings').controller('SettingsController', SettingsController);
})();
