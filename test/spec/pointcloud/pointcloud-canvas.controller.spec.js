'use strict';

describe('pointcloud-canvas.controller', function() {

  // load the module
  beforeEach(module('pattyApp.pointcloud'));

  var $rootScope;
  var ctrl;
  var PointcloudService;
  beforeEach(function() {
    inject(function(_$rootScope_, _$controller_, _PointcloudService_) {
      $rootScope = _$rootScope_;
      var $controller = _$controller_;
      PointcloudService = _PointcloudService_;
      ctrl = $controller('PointcloudCanvasController');
    });
  });

  describe('attachCanvas', function() {

    it('should call attachCanvas() of PointcloudService', function() {
      var el = angular.element('<patty-pointcloud-canvas></patty-pointcloud-canvas>');
      spyOn(PointcloudService, 'attachCanvas');

      ctrl.attachCanvas(el);

      expect(PointcloudService.attachCanvas).toHaveBeenCalledWith(el);
    });
  });
});
