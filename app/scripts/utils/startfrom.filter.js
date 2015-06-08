(function() {
  'use strict';

  function startFrom() {
    return function(input, start) {
      start = +start; //parse to int
      return input.slice(start);
    };
  }

  angular.module('pattyApp.utils')
    .filter('startFrom', startFrom);
})();
