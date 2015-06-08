(function() {
  'use strict';

  function pattyHelp() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/help/help.directive.html',
      controller: 'HelpController',
      controllerAs: 'hc'
    };
  }

  angular.module('pattyApp.help')
    .directive('pattyHelp', pattyHelp);
})();
