/**
 * @namespace core
 */
(function() {
  'use strict';

  /**
   * @class
   * @memberOf core
   */
  function DrivemapService($http, $q, $log, proj4, pattyConf) {
    var me = this;
    this.data = {};
    var deferred = $q.defer();

    /**
     * Promise for loading the sites remotely.
     * Can be used to perform action when loading sites has been completed.
     *
     * @type {Promise}
     */
    this.ready = deferred.promise;

    /**
     * Load drivemap data from server
     *
     * @returns {Promise}
     */
    this.load = function() {
      return $http.get(pattyConf.DRIVEMAP_JSON_URL).then(this.onLoad, this.onLoadFailure);
    };

    this.onLoad = function(response) {
      me.data = response.data;

      me.registerProj4();

      deferred.resolve(response);
    };

    this.onLoadFailure = function() {
      $log.log('Failed to load drive map!!');
      deferred.reject.apply(this, arguments);
    };

    /**
     * The drivemap is in a coordinate system.
     * The coordinate system label is the crs.
     * The proj4 definition is the proj4 property of the first feature.
     */
    this.registerProj4 = function() {
      proj4.defs(this.getCrs(), this.data.features[0].properties.proj4);
    };

    this.getPointcloudUrl = function() {
      return this.data.features[0].properties.pointcloud;
    };
    this.getCameraPath = function() {
      return this.data.features[0].geometry.coordinates;
    };
    this.getLookPath = function() {
      return this.data.features[0].properties.lookatpath;
    };
    this.getCrs = function() {
      return this.data.crs.properties.name;
    };
  }

  angular.module('pattyApp.core')
    .service('DrivemapService', DrivemapService);
})();
