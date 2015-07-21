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
      var expected = '[{"x":684996.7171887874,"y":0,"z":-483250.241443769},{"x":-67941.98617179257,"y":0,"z":826468.8260205447},{"x":-887394.4108622714,"y":0,"z":453156.10322779755},{"x":-49396.20206809977,"y":0,"z":-1004521.9764360117}]';
      expect(listener).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });

    it('should publish "cameraMoved" message with camera 2d frustum when camera has rotated', function() {
      service.camera.lookAt(new THREE.Vector3(1, 1, 1));
      service.camera.updateMatrixWorld();

      service.update();

      // comparing floats fails, so serialize
      var result = JSON.stringify(listener.calls.argsFor(0)[1]);
      var expected = '[{"x":-811878.9718328929,"y":0,"z":399219.9886011715},{"x":-58575.84382072059,"y":0,"z":-911149.4051169781},{"x":81607525.91073923,"y":0,"z":-830560584.775058},{"x":-671695602.101433,"y":0,"z":479808808.9430916}]';
      expect(listener).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });

    it('should publish "cameraMoved" message with camera 2d frustum when camera has zoomed in', function() {
      service.camera.fov = 50;
      service.camera.updateProjectionMatrix();

      service.update();

      // comparing floats fails, so serialize
      var result = JSON.stringify(listener.calls.argsFor(0)[1]);
      var expected = '[{"x":-625104.6593692244,"y":0,"z":312819.50949880836},{"x":-37837.61145812042,"y":0,"z":-708717.7105740967},{"x":5374389.258166685,"y":0,"z":-2462338.1685317094},{"x":628150.325004511,"y":0,"z":5793636.799007997}]';
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
