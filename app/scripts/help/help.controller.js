(function() {
  'use strict';

  function HelpController() {
    this.showHelp = false;
  }

  angular.module('pattyApp.help')
    .controller('HelpController', HelpController);
})();
