(function() {
  'use strict';

  function helpModalDirective() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/helpModal/helpModal.directive.html',
      link: function(scope) {
        scope.helpModal.init();
      },
      controller: 'HelpModalController',
      controllerAs: 'helpModal'
    };
  }

  angular.module('pattyApp.helpModal').directive('helpModalDirective', helpModalDirective);
})();
