(function() {
  'use strict';

  function ExtractionSelectionService() {
    return {
      lon1: 93720.22,
      lat1: 436899.97,
      lon2: 94428.37,
      lat2: 438334.32
    };
  }

  angular.module('pattyApp.extract')
    .factory('ExtractionSelectionService', ExtractionSelectionService);
})();
