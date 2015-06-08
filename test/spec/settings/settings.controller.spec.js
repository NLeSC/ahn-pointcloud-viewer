'use strict';

describe('settings.controller', function() {

  // load the module
  beforeEach(module('pattyApp.settings'));

  var $rootScope;
  var ctrl;
  var PointcloudService;
  beforeEach(function() {
    inject(function(_$rootScope_, _$controller_, _PointcloudService_) {
      $rootScope = _$rootScope_;
      var $controller = _$controller_;
      PointcloudService = _PointcloudService_;

      ctrl = $controller('SettingsController');
    });
  });

  describe('initial state', function() {

    it('should set showSettings to false', function() {
      expect(ctrl.showSettings).toBe(false);
    });

    it('should have settings same as Pointcloud Service', function() {
      expect(ctrl.settings).toBe(PointcloudService.settings);
    });
  });

  describe('recordCameraLocation() function', function() {
    it('should call recordLocation() of CameraService', inject(function(CameraService) {
      spyOn(CameraService, 'recordLocation');

      ctrl.recordCameraLocation();

      expect(CameraService.recordLocation).toHaveBeenCalledWith();
    }));
  });
});
