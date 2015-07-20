(function() {
  'use strict';

  function CamFrustumService(ol, THREE) {
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
      var maxlength = 100 * 1000;

      var coordinates =  this.camFrustum.getCoordinates();
      var leftBottom  = new THREE.Vector3(coordinates[0][0], coordinates[0][1], 0);
      var rightBottom = new THREE.Vector3(coordinates[1][0], coordinates[1][1], 0);
      var leftTop  = new THREE.Vector3(coordinates[2][0], coordinates[2][1], 0);
      var rightTop  = new THREE.Vector3(coordinates[3][0], coordinates[3][1], 0);

      var middleBottom = leftBottom.clone().lerp(rightBottom, 0.5);
      var middleTop = leftTop.clone().lerp(rightTop, 0.5);

      var dist = middleBottom.clone().sub(middleTop).length();

      if (dist > maxlength) {
        dist = maxlength;
      }
      var frac = 1 - (dist / maxlength);

      var mapCameraPos = middleBottom.clone().lerp(middleTop, frac);
      return mapCameraPos.toArray();
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
