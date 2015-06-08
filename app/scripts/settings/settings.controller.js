(function() {
  'use strict';

  function SettingsController(PointcloudService, CameraService) {
    this.showSettings = false;
    this.showSiteSettings = false;

    this.settings = PointcloudService.settings;
    this.siteSettings = PointcloudService.siteSettings;

    this.PointcloudService = PointcloudService;

    this.recordCameraLocation = function() {
      CameraService.recordLocation();
    };

    this.toggleSettings = function() {
      this.showSettings = !this.showSettings;
      this.showSiteSettings = false;

      if (this.showSettings && PointcloudService.isInOrbitMode) {
        this.showSiteSettings = true;
      }
    };
  }

  angular.module('pattyApp.settings').controller('SettingsController', SettingsController);
})();
