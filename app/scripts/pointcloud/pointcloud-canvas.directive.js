(function() {
  'use strict';

function pattyPointcloudCanvas() {
  return {
    restrict: 'E',
    link: function(scope, element) {
      scope.vm.attachCanvas(element[0]);
    },
    controller: 'PointcloudCanvasController',
    controllerAs: 'vm'
  };
}

angular.module('pattyApp.pointcloud')
  .directive('pattyPointcloudCanvas', pattyPointcloudCanvas);
})();
