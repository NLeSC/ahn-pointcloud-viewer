(function() {
  'use strict';

  function pattySearchPanel() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/searchbox/searchbox.directive.html',
      controller: 'SearchPanelController',
      controllerAs: 'sp'
    };
  }

  angular.module('pattyApp.searchbox')
    .directive('pattySearchPanel', pattySearchPanel);
})();
