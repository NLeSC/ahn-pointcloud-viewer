(function() {
  'use strict';

  function pattyMinimap() {
    return {
      restrict: 'E',
      link: function(scope, element) {
        scope.vm.map.setTarget(element[0]);
      },
      controller: 'MinimapController',
      controllerAs: 'vm'
    };
  }

  angular.module('pattyApp.minimap')
    .directive('pattyMinimap', pattyMinimap);
})();
