(function() {
  'use strict';

  function CamFrustumService(ol, proj4, DrivemapService) {
    var olProjectionCode = 'urn:ogc:def:crs:EPSG::28992';
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

    this.getCameraPosition = function() {
      return this.camFrustum.getFirstCoordinate();
    };

    this.onCameraMove = function(frustum) {
      var frustumGeo = frustum.map(function(corner) {
          return proj4(siteProjectionCode, olProjectionCode, [corner.x, corner.y]);
      });
      frustumGeo.push(frustumGeo[0]);
      this.camFrustum.setCoordinates(frustumGeo);
    };
  }

  angular.module('pattyApp.minimap')
    .service('CamFrustumService', CamFrustumService);
})();
