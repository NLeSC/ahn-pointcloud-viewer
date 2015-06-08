/* global proj4:false */
(function() {
  'use strict';

  angular.module('pattyApp.core')
    .constant('proj4', proj4)
    .constant('pattyConf', {
      // SITES_JSON_URL: 'http://148.251.106.132:8090/POTREE/CONF.json',
      // to work without server uncomment below
      SITES_JSON_URL: 'data/sites.json',
      DRIVEMAP_JSON_URL: 'data/drivemap.json'
    });
})();
