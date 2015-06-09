(function() {
  'use strict';

  function ExtractionSelectionService() {
    return {
      lon1: 93720.22,
      lat1: 436899.97,
      lon2: 94428.37,
      lat2: 438334.32,
      toRequest: function() {
        var request = {
          left: this.lon1,
          bottom: this.lat1,
          right: this.lon2,
          top: this.lat2
        };
        if (this.lon1 > this.lon2) {
          request.left = this.lon2;
          request.right = this.lon1;
        }
        if (this.lat1 > this.lat2) {
          request.bottom = this.lat2;
          request.top = this.lat1;
        }
        return request;
      }
    };
  }

  angular.module('pattyApp.extract')
    .factory('ExtractionSelectionService', ExtractionSelectionService);
})();
