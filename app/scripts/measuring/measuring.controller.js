(function() {
  'use strict';

  function MeasuringController(MeasuringService, Messagebus) {
    this.showToolboxTray = false;
    this.showTransformationToolboxTray = false;

    this.distanceActive = false;
    this.angleActive = false;
    this.areaActive = false;
    this.volumeActive = false;
    this.heightProfileActive = false;
    this.clipVolumeActive = false;

    this.measuringService = MeasuringService;

    this.toggleToolbox = function() {
      this.resetState();

      if (!this.showToolboxTray) {
        Messagebus.publish('closeOtherPanels', 'toolbox');

        this.showToolboxTray = true;
      } else {
        this.showToolboxTray = false;        
      }
    };
      
    this.panelClose = function(event, panelNameToRemainOpen) {
      if (panelNameToRemainOpen !== 'toolbox') {
        this.resetState();
        this.showToolboxTray = false;
      }
    }.bind(this);
    
    Messagebus.subscribe('closeOtherPanels', this.panelClose);

    this.resetState = function() {
      this.distanceActive = false;
      this.angleActive = false;
      this.areaActive = false;
      this.volumeActive = false;
      this.heightProfileActive = false;
      this.clipVolumeActive = false;

      this.showTransformationToolboxTray = false;

      this.measuringService.clear();
    };

    this.isTransformationRotate = function() {
      var result = false;
      if (this.measuringService.activeTransformationTool === this.measuringService.transformationTools.ROTATE) {
        result = true;
      }
      return result;
    };

    this.isTransformationTranslate = function() {
      var result = false;
      if (this.measuringService.activeTransformationTool === this.measuringService.transformationTools.TRANSLATE) {
        result = true;
      }
      return result;
    };

    this.isTransformationScale = function() {
      var result = false;
      if (this.measuringService.activeTransformationTool === this.measuringService.transformationTools.SCALE) {
        result = true;
      }
      return result;
    };

    this.startDistance = function() {
      this.resetState();
      this.distanceActive = true;
      this.measuringService.startDistance();
    };

    this.startAngle = function() {
      this.resetState();
      this.angleActive = true;
      this.measuringService.startAngle();
    };

    this.startArea = function() {
      this.resetState();
      this.areaActive = true;
      this.measuringService.startArea();
    };

    this.startAngle = function() {
      this.resetState();
      this.angleActive = true;
      this.measuringService.startAngle();
    };

    this.startVolume = function() {
      this.resetState();
      this.volumeActive = true;
      this.showTransformationToolboxTray = true;
      this.measuringService.startVolume();

    };

    this.startHeightProfile = function() {
      this.resetState();
      this.heightProfileActive = true;
      this.measuringService.startHeightProfile();
    };

    this.startClipVolume = function() {
      this.resetState();
      this.clipVolumeActive = true;
      this.showTransformationToolboxTray = true;
      this.measuringService.startClipVolume();
    };

    this.toggleRotate = function() {
      this.measuringService.activeTransformationTool = this.measuringService.transformationTools.ROTATE;
      this.resetState();
      this.showTransformationToolboxTray = true;
      this.measuringService.tools.transformation.rotate();
    };

    this.toggleTranslate = function() {
      this.measuringService.activeTransformationTool = this.measuringService.transformationTools.TRANSLATE;
      this.resetState();
      this.showTransformationToolboxTray = true;
      this.measuringService.tools.transformation.translate();
    };

    this.toggleScale = function() {
      this.measuringService.activeTransformationTool = this.measuringService.transformationTools.SCALE;
      this.resetState();
      this.showTransformationToolboxTray = true;
      this.measuringService.tools.transformation.scale();
    };
  }

  angular.module('pattyApp.measuring').controller('MeasuringController', MeasuringController);
})();
