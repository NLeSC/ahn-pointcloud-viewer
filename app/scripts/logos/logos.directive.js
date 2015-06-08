(function() {
  'use strict';

  function logoBoxDirective() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/logos/logos.directive.html'
    };
  }

  angular.module('pattyApp.logos').directive('logoBoxDirective', logoBoxDirective);
})();
