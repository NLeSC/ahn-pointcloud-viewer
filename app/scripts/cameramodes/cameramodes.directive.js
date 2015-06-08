(function() {
  'use strict';

  function pattyCameraModes() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/cameramodes/cameramodes.directive.html',
      controller: 'CameramodesController',
      controllerAs: 'cmc'
    };
  }

  angular.module('pattyApp.cameramodes')
    .directive('pattyCameraModes', pattyCameraModes);
})();
