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
      var rightBottomCorner = new THREE.Vector3(1, -1, 1).unproject(this.camera).normalize();
      var leftBottomCorner = new THREE.Vector3(-1, -1, 1).unproject(this.camera).normalize();

      var leftTopCorner = new THREE.Vector3(-1, 1, 1).unproject(this.camera).normalize();
      var rightTopCorner = new THREE.Vector3(1, 1, 1).unproject(this.camera).normalize();

      var viewport = [null, null, null, null];
      var floorInSight = true;
      var ray, intersection, invertedYcamera;

      invertedYcamera = this.camera.position.clone();
      invertedYcamera.y = -invertedYcamera.y;

      ray = new THREE.Ray(this.camera.position, rightBottomCorner);
      intersection = ray.intersectPlane(this.floor);
      if (intersection) {
        viewport[0] = intersection;

        ray = new THREE.Ray(this.camera.position, leftBottomCorner);
        intersection = ray.intersectPlane(this.floor);
        viewport[1] = intersection;
      }

      ray = new THREE.Ray(this.camera.position, leftTopCorner);
      intersection = ray.intersectPlane(this.floor);
      if (intersection) {
        viewport[2] = intersection;

        ray = new THREE.Ray(this.camera.position, rightTopCorner);
        intersection = ray.intersectPlane(this.floor);
        viewport[3] = intersection;
      }

      if (viewport[0] === null) {
        //No bottom intersection was found
        if (viewport[3] === null) {
          //No intersections whatsoever. We will swap Y direction of camera.
          ray = new THREE.Ray(invertedYcamera, rightBottomCorner);
          intersection = ray.intersectPlane(this.floor);
          viewport[2] = intersection;

          ray = new THREE.Ray(invertedYcamera, leftBottomCorner);
          intersection = ray.intersectPlane(this.floor);
          viewport[3] = intersection;

          ray = new THREE.Ray(invertedYcamera, leftTopCorner);
          intersection = ray.intersectPlane(this.floor);
          viewport[0] = intersection;

          ray = new THREE.Ray(invertedYcamera, rightTopCorner);
          intersection = ray.intersectPlane(this.floor);
          viewport[1] = intersection;

          floorInSight = false;
        } else {
          //This happens when we are under the y = 0 plane and looking up;
          viewport[0] = viewport[2].clone();
          viewport[1] = viewport[3].clone();

          var directionToViewport2 = new THREE.Vector3().subVectors(viewport[2], this.camera.position);
          var directionToViewport3 = new THREE.Vector3().subVectors(viewport[3], this.camera.position);

          //Look out, this is intentionally cross-eyed
          viewport[2] = directionToViewport3.multiplyScalar(1000);
          viewport[3] = directionToViewport2.multiplyScalar(1000);

          viewport[2].y = 0;
          viewport[3].y = 0;
        }
      } else {
        if (viewport[3] === null) {
          // A bottom intersection was found, but no top intersection. We are looking over the horizon.
          var directionToViewport0 = new THREE.Vector3().subVectors(viewport[0], this.camera.position);
          var directionToViewport1 = new THREE.Vector3().subVectors(viewport[1], this.camera.position);

          //Look out, this is intentionally cross-eyed
          viewport[2] = directionToViewport1.multiplyScalar(1000);
          viewport[3] = directionToViewport0.multiplyScalar(1000);

          viewport[2].y = 0;
          viewport[3].y = 0;
        } else {
          //We could be under the plane, if so we need to swap near/far
          if (this.camera.position.y < 0) {
            var temp0 = viewport[0];
            var temp1 = viewport[1];
            viewport[0] = viewport[2];
            viewport[1] = viewport[3];
            viewport[2] = temp0;
            viewport[3] = temp1;
          }
        }
      }

      var cameraFloorViewport = viewport.map(function(corner) {
        return SceneService.toGeo(corner);
      });

      Messagebus.publish('cameraMoved', cameraFloorViewport, floorInSight);
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
