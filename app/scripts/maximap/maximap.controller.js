(function() {
  'use strict';

  function MaximapController(MaximapService) {
    this.service = MaximapService;
  }

  angular.module('pattyApp.maximap')
    .controller('MaximapController', MaximapController);
})();
