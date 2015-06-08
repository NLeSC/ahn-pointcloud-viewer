(function() {
  'use strict';

  function PointcloudCanvasController(PointcloudService) {
    this.attachCanvas = function(el){
      PointcloudService.attachCanvas(el);
    };
  }

  angular.module('pattyApp.pointcloud')
  .controller('PointcloudCanvasController', PointcloudCanvasController);
})();
