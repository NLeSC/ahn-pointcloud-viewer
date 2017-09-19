// The app
/* global THREE:false, POCLoader:false, Potree:false  */

(function() {
  'use strict';

  angular.module('pattyApp.three', [])
    .constant('THREE', THREE);

  angular.module('pattyApp.potree', [])
    .constant('Potree', Potree)
    /*
    .run(function(Potree, THREE) {
      Potree.TextSprite.prototype.setTextOriginal = Potree.TextSprite.prototype.setText;
      // var originalPotreeTextSpritePrototype = Potree.TextSprite.prototype;
      // originalPotreeTextSprite.prototype = originalPotreeTextSpritePrototype;
      Potree.TextSprite.prototype.setText = function(text) {
        console.log("jeuj");
        Potree.TextSprite.prototype.setTextOriginal(text);
      };
      console.log(Potree.TextSprite.prototype.setText === Potree.TextSprite.prototype.setTextOriginal);
      // Potree.TextSprite.prototype = originalPotreeTextSpritePrototype;
*/

    // WORKING ON ISSUE #50
/*      var textSprite = Potree.TextSprite;
      var textSpritePrototype = Potree.TextSprite.prototype;
      var setText = Potree.TextSprite.prototype.setText;
      var setTextColor = Potree.TextSprite.prototype.setTextColor;
      var setBorderColor = Potree.TextSprite.prototype.setBorderColor;
      var setBackgroundColor = Potree.TextSprite.prototype.setBackgroundColor;
      var update = Potree.TextSprite.prototype.update;
      var roundRect = Potree.TextSprite.prototype.roundRect;
      Potree.TextSprite = function(text) {
        console.log('jeuj');
        textSprite(text);
      };
      Potree.TextSprite.prototype = new THREE.Object3D();
      Potree.TextSprite.prototype.setText = setText;
      Potree.TextSprite.prototype.setTextColor = setTextColor;
      Potree.TextSprite.prototype.setBorderColor = setBorderColor;
      Potree.TextSprite.prototype.setBackgroundColor = setBackgroundColor;
      Potree.TextSprite.prototype.update = update;
      Potree.TextSprite.prototype.roundRect = roundRect;
    })
    */
    ;

  /**
   * @ngdoc overview
   * @name pattyApp
   * @description
   * # pattyApp
   *
   * Main module of the application.
   */
  angular
    .module('pattyApp', [
      'ngAnimate',
      'ngSanitize',
      'ngTouch',
      'ui.bootstrap',
      'pattyApp.logos',
      'pattyApp.searchbox',
      'pattyApp.minimap',
      //'pattyApp.maximap',
      'pattyApp.measuring',
      'pattyApp.settings',
      'pattyApp.help',
      'pattyApp.cameramodes',
      'pattyApp.pointcloud',
      'pattyApp.extract',
      'pattyApp.biglegend',
      'pattyApp.earthcontrols'
    ])
    .config(function($compileProvider) {
       // data urls are not allowed by default, so whitelist them
       $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
    })
    .run(function(DrivemapService) {      
      DrivemapService.load();
    });

  angular.module('pattyApp.templates', []);
  angular.module('pattyApp.logos', []);
  angular.module('pattyApp.extract', ['pattyApp.core', 'angular-loading-bar', 'rt.debounce']);
  angular.module('pattyApp.utils', ['pattyApp.templates', 'toastr']);
  angular.module('pattyApp.core', ['pattyApp.utils']);
  angular.module('pattyApp.minimap', ['pattyApp.core', 'pattyApp.three']);
  //angular.module('pattyApp.maximap', ['pattyApp.core', 'pattyApp.three']);
  angular.module('pattyApp.measuring', ['pattyApp.potree', 'pattyApp.three']);
  angular.module('pattyApp.pointcloud', ['pattyApp.core', 'pattyApp.potree', 'pattyApp.three', 'pattyApp.measuring', 'cfp.loadingBar', 'pattyApp.extract', 'pattyApp.earthcontrols', 'pattyApp.utils']);
  angular.module('pattyApp.settings', ['pattyApp.pointcloud', 'ngFileUpload']);
  angular.module('pattyApp.help', ['pattyApp.templates']);
  angular.module('pattyApp.cameramodes', ['pattyApp.pointcloud']);
  angular.module('pattyApp.searchbox', ['pattyApp.core', 'pattyApp.pointcloud']);
  angular.module('pattyApp.biglegend', ['pattyApp.utils']);
  angular.module('pattyApp.earthcontrols', ['pattyApp.utils', 'pattyApp.three', 'pattyApp.pointcloud']);
})();
