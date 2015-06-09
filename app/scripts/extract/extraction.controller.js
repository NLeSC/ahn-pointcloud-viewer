(function() {
  'use strict';

  function ExtractionController(ExtractionSelectionService) {
    this.showForm = false;
    this.selection = ExtractionSelectionService;
    this.email = '';
    this.numberofpoints = 0;
  }

  angular.module('pattyApp.extract')
    .controller('ExtractionController', ExtractionController);
})();
