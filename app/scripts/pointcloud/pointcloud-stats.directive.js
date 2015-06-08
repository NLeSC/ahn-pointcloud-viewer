(function() {
  'use strict';

  function pattyPointcloudStats() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/pointcloud/pointcloud-stats.directive.html',
      controller: 'PointcloudStatsController',
      controllerAs: 'pcs'
    };
  }

  angular.module('pattyApp.pointcloud')
    .directive('pattyPointcloudStats', pattyPointcloudStats);
})();
