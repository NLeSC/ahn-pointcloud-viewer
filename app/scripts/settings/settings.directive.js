(function() {
  'use strict';

  function pattySettings() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/settings/settings.directive.html',
      controller: 'SettingsController',
      controllerAs: 'sc'
    };
  }

  angular.module('pattyApp.settings')
    .directive('pattySettings', pattySettings);
})();
