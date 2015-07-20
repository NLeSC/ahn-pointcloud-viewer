'use strict';

describe('pointcloud.CameraService', function() {

  var mockWindow;
  beforeEach(module('pattyApp.pointcloud', function($provide) {
    mockWindow = {
      innerWidth: 1920,
      innerHeight: 1200,
      addEventListener: jasmine.createSpy('addEventListener')
    };
    $provide.value('$window', mockWindow);
  }));

  var service;
  var THREE;
  var SceneService;
  beforeEach(function() {
    inject(function(_CameraService_, _THREE_, _SceneService_) {
      service = _CameraService_;
      THREE = _THREE_;
      SceneService = _SceneService_;
      SceneService.toGeo = function(d) {
        return d.negate();
      };
    });
  });

  describe('initial state', function() {
    it('camera should have aspect', function() {
      expect(service.camera.aspect).toEqual(1.6);
    });

    it('should listen on window resize', function() {
      expect(mockWindow.addEventListener).toHaveBeenCalledWith('resize', jasmine.any(Function));
    });
  });

  describe('update() function', function() {
    var listener, unsubscriber;
    beforeEach(function() {
      inject(function(Messagebus) {
        service.camera.position.copy(new THREE.Vector3(140183.36973145982, 351353.9722696242, 80588.82034192001));
        service.camera.lookAt(new THREE.Vector3(0.8400271569613131, -0.5345354465470192, -0.09287751047628326));
        service.camera.updateMatrixWorld();
        service.update();

        listener = jasmine.createSpy('listener');
        unsubscriber = Messagebus.subscribe('cameraMoved', listener);
      });
    });

    afterEach(function() {
      unsubscriber();
    });

    it('should publish "cameraMoved" message with camera 2d frustum when camera has moved', function() {
      service.camera.position.copy(new THREE.Vector3(140183.36973145982, 3888888.0, 80588.82034192001));
      service.camera.updateMatrixWorld();

      service.update();

      // comparing floats fails, so serialize
      var result = JSON.stringify(listener.calls.argsFor(0)[1]);
      var expected = '[{"x":-140183.36973145982,"y":-3888888,"z":-80588.82034192001},{"x":230970.5373948199,"y":0,"z":-843344.3357521717},{"x":965363.4566517072,"y":0,"z":-322072.600759929},{"x":212424.7532911271,"y":0,"z":987646.4667043848}]';
      expect(listener).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });

    it('should publish "cameraMoved" message with camera 2d frustum when camera has rotated', function() {
      service.camera.lookAt(new THREE.Vector3(1, 1, 1));
      service.camera.updateMatrixWorld();

      service.update();

      // comparing floats fails, so serialize
      var result = JSON.stringify(listener.calls.argsFor(0)[1]);
      var expected = '[{"x":-140183.36973145982,"y":-351353.9722696242,"z":-80588.82034192001},{"x":-6796701.543238078,"y":0,"z":3167591.346057139},{"x":-140183.36973145982,"y":-351353.9722696242,"z":-80588.82034192001},{"x":811876.7059218518,"y":0,"z":-399214.4336573684}]';
      expect(listener).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });

    it('should publish "cameraMoved" message with camera 2d frustum when camera has zoomed in', function() {
      service.camera.fov = 50;
      service.camera.updateProjectionMatrix();

      service.update();

      // comparing floats fails, so serialize
      var result = JSON.stringify(listener.calls.argsFor(0)[1]);
      var expected = '[{"x":140183.36973145982,"y":351353.9722696242,"z":80588.82034192001},{"x":-37837.61145812042,"y":0,"z":-708717.7105740967},{"x":5374389.258166685,"y":0,"z":-2462338.1685317094},{"x":628150.325004511,"y":0,"z":5793636.799007997}]';
      expect(listener).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });

    it('should not publish "cameraMoved" message when camera has not changed orientation', function() {
      service.update();

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('onWindowResize() function', function() {
    it('should update aspect of camera', function() {
      mockWindow.innerWidth = 1440;
      mockWindow.innnerHeight = 768;

      service.onWindowResize();

      expect(service.camera.aspect).toEqual(1.2);
    });
  });
});
