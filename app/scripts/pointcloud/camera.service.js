(function() {
  'use strict';

  function CameraService($window, $log, THREE, Messagebus, SceneService) {
    var me = this;
    var fov = 75;
    var width = $window.innerWidth;
    var height = $window.innerHeight;
    var aspect = width / height;
    var near = 0.1;
    var far = 100000;

    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.toGeo = null;
    this.waypoints = [];
    $window.addEventListener('resize', function() {
      me.onWindowResize();
    });

    this.recordLocation = function() {
      this.waypoints.push(SceneService.toGeo(this.camera.position.clone()).toArray());
      $log.log(JSON.stringify(this.waypoints));
      // TODO refactor to own service 
	  // also record look at position from x y angles + distance
    };

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
      var camera = this.camera;
      var aspect = camera.aspect;
      var top = Math.tan(THREE.Math.degToRad(camera.fov * 0.5)) * camera.near;
      var bottom = -top;
      var left = aspect * bottom;
      var right = aspect * top;

      var camPos = new THREE.Vector3(0, 0, 0);
      left = new THREE.Vector3(left, 0, -camera.near).multiplyScalar(3000);
      right = new THREE.Vector3(right, 0, -camera.near).multiplyScalar(3000);
      camPos.applyMatrix4(camera.matrixWorld);
      left.applyMatrix4(camera.matrixWorld);
      right.applyMatrix4(camera.matrixWorld);

      camPos = SceneService.toGeo(camPos);
      left = SceneService.toGeo(left);
      right = SceneService.toGeo(right);

      Messagebus.publish('cameraMoved', {
        cam: camPos,
        left: left,
        right: right
      });
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
