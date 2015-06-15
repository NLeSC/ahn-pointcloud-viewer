(function() {
  'use strict';

  function pattyMaximap() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/maximap/maximap.directive.html',
      link: function(scope, element) {
        scope.maximap.service.setTarget();
      },
      controller: 'MaximapController',
      controllerAs: 'maximap'
    };
  }

  angular.module('pattyApp.maximap')
    .directive('pattyMaximap', pattyMaximap);
})();
