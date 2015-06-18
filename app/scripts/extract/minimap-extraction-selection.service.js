(function() {
  'use strict';

  function MinimapExtractionSelectionService(ExtractionSelectionService, ol, proj4, Messagebus) {
    this.dragBox = new ol.interaction.DragBox({
      // condition: ol.events.condition.shiftKeyOnly,
      style: new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: [0, 255, 0, 1]
        })
      })
    });
    this.dragBox.setActive(false);

    this.dragBox.on('boxend', function() {
      var coordinates = this.dragBox.getGeometry().getCoordinates();
      var topright = {lon: coordinates[0][3][0], lat: coordinates[0][3][1]};
      var bottomleft = {lon: coordinates[0][1][0], lat: coordinates[0][1][1]};
      ExtractionSelectionService.setTopRightCoordinates(topright);
      ExtractionSelectionService.setBottomLeftCoordinates(bottomleft);
    }.bind(this));

    this.remoteSelectionChanged = function(event, bbox) {
      // resize dragbox
      var geom = this.dragBox.getGeometry();
      var coordinates = [[
        bbox.left, bbox.top
      ], [
        bbox.right, bbox.top
      ], [
        bbox.right, bbox.bottom
      ], [
        bbox.left, bbox.bottom
      ], [
        bbox.left, bbox.top
      ]];
      console.log(coordinates);
      // geom.setCoordinates(coordinates);
    };

    this.activationChanged = function(event, active) {
      // hide dragbox or show dragbox
      this.dragBox.setActive(active);
    };

    Messagebus.subscribe('extractionSelectionChanged', this.remoteSelectionChanged.bind(this));
    Messagebus.subscribe('extractionSelectionActivationChanged', this.activationChanged.bind(this));

    this.init = function(map) {
      map.addInteraction(this.dragBox);
    };
  }

  angular.module('pattyApp.extract')
    .service('MinimapExtractionSelectionService', MinimapExtractionSelectionService);
})();
