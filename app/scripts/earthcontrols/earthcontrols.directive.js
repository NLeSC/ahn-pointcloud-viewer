(function() {
  'use strict';

  function earthcontrolsDirective() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/earthcontrols/earthcontrols.directive.html',
      controller: 'EarthcontrolsController',
      controllerAs: 'earthcontrols'
    };
  }

  angular.module('pattyApp.earthcontrols')
    .directive('earthcontrolsDirective', earthcontrolsDirective);
})();
