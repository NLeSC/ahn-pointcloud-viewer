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
        listener = jasmine.createSpy('listener');
        unsubscriber = Messagebus.subscribe('cameraMoved', listener);
      });
    });

    afterEach(function() {
      unsubscriber();
    });

    it('should publish "cameraMoved" message with camera 2d frustum when camera has rotated', function() {
      service.camera.lookAt(new THREE.Vector3(1, 1, 1));
      service.camera.updateMatrixWorld();

      service.update();

      // comparing floats fails, so serialize
      var result = JSON.stringify(listener.calls.argsFor(0)[1]);
      var expected = '{"cam":{"x":0,"y":0,"z":0},"left":{"x":-433.6444891528704,"y":-173.20508153198415,"z":87.23433385654471},"right":{"x":87.23433385654471,"y":-173.20507376434153,"z":-433.6444891528704}}';
      expect(listener).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });

    it('should publish "cameraMoved" message with camera 2d frustum when camera has zoomed in', function() {
      service.camera.fov = 50;
      service.camera.updateProjectionMatrix();

      service.update();

      // comparing floats fails, so serialize
      var result = JSON.stringify(listener.calls.argsFor(0)[1]);
      var expected = '{"cam":{"x":0,"y":0,"z":0},"left":{"x":223.82767591439935,"y":0,"z":300},"right":{"x":-223.82767591439935,"y":0,"z":300}}';
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
