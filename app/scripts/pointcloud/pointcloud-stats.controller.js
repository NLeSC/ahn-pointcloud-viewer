(function() {
  'use strict';

  function PointcloudStatsController(PointcloudService) {
    this.stats = PointcloudService.stats;
    this.settings = PointcloudService.settings;
  }

  angular.module('pattyApp.pointcloud')
  .controller('PointcloudStatsController', PointcloudStatsController);
})();
