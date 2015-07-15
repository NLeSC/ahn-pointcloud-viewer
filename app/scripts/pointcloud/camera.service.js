var thecamera;

(function() {
  'use strict';

  function CameraService($window, $log, THREE, Messagebus, SceneService) {
    var me = this;
    var fov = 75;
    var width = $window.innerWidth;
    var height = $window.innerHeight;
    var aspect = width / height;
    var near = 0.1;
    var far = 100 * 1000 * 6;


    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.floor = new THREE.Plane(
      new THREE.Vector3(0, 1, 0),
      0
    );

    $window.addEventListener('resize', function() {
      me.onWindowResize();
    });

    this.getCameraOrientation = function() {
      return new THREE.Matrix4().multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorld).determinant();
    };
    var prevCameraOrientation = this.getCameraOrientation();

    this.update = function() {
      // create hash for camera state
      var cameraOrientation = this.getCameraOrientation();
      if (cameraOrientation !== prevCameraOrientation) {
        this.update2DFrustum();
      }
      // compare current camera state with state in previous render loop
      prevCameraOrientation = cameraOrientation;
    };

    this.update2DFrustum = function() {
      // See THREE.CameraHelper
      var corners = [
        new THREE.Vector3().set(-1, -1, 1).unproject(this.camera).normalize(),
        new THREE.Vector3().set(1, -1, 1).unproject(this.camera).normalize(),
        new THREE.Vector3().set(-1, 1, 1).unproject(this.camera).normalize(),
        new THREE.Vector3().set(1, 1, 1).unproject(this.camera).normalize()
      ];

      var cameraFloorViewport = corners.map(function(corner) {
        var ray = new THREE.Ray(this.camera.position, corner);
        var intersection = ray.intersectPlane(this.floor);
        if (intersection) {
          return intersection;
        } else {
          // TODO no intersection with plane so need to find a alternative corner.
        }
      }.bind(this));

      Messagebus.publish('cameraMoved', cameraFloorViewport);
    };

    this.onWindowResize = function() {
      // resize
      var width = $window.innerWidth;
      var height = $window.innerHeight;
      var aspect = width / height;

      this.camera.aspect = aspect;
      this.camera.updateProjectionMatrix();
    };
  }

  angular.module('pattyApp.pointcloud')
    .service('CameraService', CameraService);
})();
