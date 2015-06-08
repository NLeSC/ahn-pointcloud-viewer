(function() {
  'use strict';

  function CamFrustumService(ol, proj4, DrivemapService) {
    var olProjectionCode = 'EPSG:28992';
    var siteProjectionCode = null;

    DrivemapService.ready.then(function() {
      siteProjectionCode = DrivemapService.getCrs();
    });

    this.camFrustum = new ol.geom.LineString([
      [0, 0],
      [0, 0]
    ]);
    var featureVector = new ol.source.Vector({
      features: [new ol.Feature(this.camFrustum)]
    });
    this.layer = new ol.layer.Vector({
      source: featureVector,
      style: new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: '#FFFFFF',
          width: 2
        })
      })
    });

    /**
     * [getExtent description]
     * @return {array} min_lon, min_lat, max_lon, max_lat
     */
    this.getExtent = function() {
      return featureVector.getExtent();
    };

    this.onCameraMove = function(frustum) {
      var camPos = proj4(siteProjectionCode, olProjectionCode, [
        frustum.cam.x, frustum.cam.y
      ]);
      var left = proj4(siteProjectionCode, olProjectionCode, [
        frustum.left.x, frustum.left.y
      ]);
      var right = proj4(siteProjectionCode, olProjectionCode, [
        frustum.right.x, frustum.right.y
      ]);
      this.camFrustum.setCoordinates([camPos, left, right, camPos]);
    };
  }

  angular.module('pattyApp.minimap')
    .service('CamFrustumService', CamFrustumService);
})();
