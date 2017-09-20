(function() {
  'use strict';

  function SettingsController(PointcloudService, MeasuringService, Messagebus, PathControls, RailService) {
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
    
    this.toggleSettings = function() {
      if (!this.showSettings) {
        Messagebus.publish('closeOtherPanels', 'settings');

        this.showSettings = true;
      } else {
        this.showSettings = false;        
      }
    };
      
    this.panelClose = function(event, panelNameToRemainOpen) {
      if (panelNameToRemainOpen !== 'settings') {
        this.showSettings = false;
      }
    }.bind(this);
    
    Messagebus.subscribe('closeOtherPanels', this.panelClose);

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
