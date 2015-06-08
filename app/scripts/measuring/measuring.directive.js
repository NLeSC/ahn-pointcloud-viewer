(function() {
  'use strict';

  function measuringDirective() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/measuring/measuring.directive.html',
      controller: 'MeasuringController',
      controllerAs: 'measuring'
    };
  }

  angular.module('pattyApp.measuring').directive('measuringDirective', measuringDirective);
})();
