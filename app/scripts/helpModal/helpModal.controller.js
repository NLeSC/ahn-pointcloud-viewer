(function() {
  'use strict';

  function HelpModalController($window, UserAgent, Messagebus) {
    this.mobile = UserAgent.mobile;

    this.checkBrowser = function() {
      var userAgent = $window.navigator.userAgent;
      
      var browsers = {chrome: /chrome/i, edge: /edge/i, safari: /safari/i, firefox: /firefox/i, ie: /internet explorer/i};
      
      for(var key in browsers) {
          if (browsers[key].test(userAgent)) {
              return key;
          }
      };

      return 'unknown';
    };
    
    this.init = function() {
      angular.element('#helpModal').modal(
        {
          'show' : 'true'
        }
      );
    };

    this.onClose = function() {
    };
    
    if (!this.mobile) {
      this.chrome = (this.checkBrowser() === 'chrome' || this.checkBrowser() === 'edge');
    }
  }

  angular.module('pattyApp.helpModal').controller('HelpModalController', HelpModalController);
})();
