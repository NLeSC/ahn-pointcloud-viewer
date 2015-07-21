(function() {
  'use strict';

  function bigLegendDirective() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/biglegend/biglegend.directive.html',
      controller: 'BigLegendController',
      controllerAs: 'blc'
    };
  }

  angular.module('pattyApp.biglegend').directive('bigLegendDirective', bigLegendDirective);
})();
