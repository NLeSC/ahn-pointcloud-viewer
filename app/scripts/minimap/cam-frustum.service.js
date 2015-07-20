(function() {
  'use strict';

  function CamFrustumService(ol) {
    this.camFrustum = new ol.geom.LineString([[0, 0], [1, 0], [0, 1]]);
    var featureVector = new ol.source.Vector({
      features: [new ol.Feature(this.camFrustum)]
    });
    this.layer = new ol.layer.Vector({
      source: featureVector,
      style: new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: 'red',
          width: 2
        })
      })
    });

    this.getExtent = function() {
      return featureVector.getExtent();
    };

    this.getCameraPosition = function() {
      var coordinates =  this.camFrustum.getCoordinates();
      var middlebottom = [
        (coordinates[0][0] + coordinates[1][0]) / 2,
        (coordinates[0][1] + coordinates[1][1]) / 2
      ];
      return middlebottom;
    };

    this.onCameraMove = function(frustum) {
      var frustumGeo = frustum.viewport.map(function(corner) {
        return [corner.x, corner.y];
      });

      if (frustum.floorInSight) {
        this.layer.getStyle().getStroke().setLineDash([]);
      } else {
        this.layer.getStyle().getStroke().setLineDash([6]);
      }

      // polygon should be a ring so duplicate start to end of ring
      frustumGeo.push(frustumGeo[0]);

      this.camFrustum.setCoordinates(frustumGeo);
    };
  }

  angular.module('pattyApp.minimap')
    .service('CamFrustumService', CamFrustumService);
})();
