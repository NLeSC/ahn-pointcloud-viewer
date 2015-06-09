(function() {
  'use strict';

  function extractionPanel() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/extract/extraction.directive.html',
      controller: 'ExtractionController',
      controllerAs: 'ec'
    };
  }

  angular.module('pattyApp.extract')
    .directive('extractionPanel', extractionPanel);
})();
