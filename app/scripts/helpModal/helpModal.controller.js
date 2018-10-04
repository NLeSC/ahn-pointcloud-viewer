(function() {
  'use strict';

  function HelpModalController($window, UserAgent) {
    this.mobile = UserAgent.mobile;
    this.doNotShow = false;

    this.dontShowClicked = function() {
      if (this.doNotShow) {
        console.log('dont show clicked');
        $window.localStorage.message = 'Do not show settings';
      } else {
        console.log('show clicked');
        $window.localStorage.message = '';
      }
    };

    this.checkBrowser = function() {
      var userAgent = $window.navigator.userAgent;

      var browsers = {chrome: /chrome/i, edge: /edge/i, safari: /safari/i, firefox: /firefox/i, ie: /internet explorer/i};

      for(var key in browsers) {
          if (browsers[key].test(userAgent)) {
              return key;
          }
      }

      return 'unknown';
    };

    this.init = function() {
      console.log('$window.localStorage.message : ' + $window.localStorage.message);
      if ($window.localStorage.message === 'Do not show settings') {
        this.doNotShow = true;
      } else {
        this.doNotShow = false;
        angular.element('#helpModal').modal(
          {
            'show' : 'true'
          }
        );
      }
    };

    this.onClose = function() {
    };

    if (!this.mobile) {
      this.chrome = (this.checkBrowser() === 'chrome' || this.checkBrowser() === 'edge');
    }
  }

  angular.module('pattyApp.helpModal').controller('HelpModalController', HelpModalController);
})();
