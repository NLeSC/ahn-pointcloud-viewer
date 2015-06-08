(function() {
  'use strict';

  function pattyMaximap() {
    return {
      restrict: 'E',
      link: function(scope, element) {
        scope.maximap.service.addCanvas(element[0]);
      },
      controller: 'MaximapController',
      controllerAs: 'maximap'
    };
  }

  angular.module('pattyApp.maximap')
    .directive('pattyMaximap', pattyMaximap);
})();
