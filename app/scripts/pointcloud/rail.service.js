(function() {
  'use strict';

  /**
   * This service contains the rail which can be edited, saved, loaded and visualized.
   * The camera can be moved on a rail as implemented with the PathControls
   */
  function RailService(CameraService, SceneService, THREE, toastr, $window) {
    /**
     * A waypoint is a user picked camera location and look at location.
     * Format of one waypoint is [camX,camY,camZ,lookatX,lookatY, lookatZ]
     * Positions are in geospatial coordinate system.
     *
     * @type {Array}
     */
    this.waypoints = [];
    this.cameraCurve = new THREE.SplineCurve3();
    this.lookatCurve = new THREE.SplineCurve3();
    /**
     * The waypoints are converted into curves.
     * The number of eque-spaced points the curve should be divided into.
     * @type {Number}
     */
    this.curveSegments = 100;
    this.lookatDistance = 100;
    /**
     * Data url for waypoints.
     * Can be used as a hyperlink to download the waypoints.
     *
     * @type {URL}
     */
    this.dataUrl = null;

    this.addCameraLocation = function() {
      var camera = CameraService.camera;
      var cameraPosition = camera.position.clone();
      var cameraPositionGeo = SceneService.toGeo(cameraPosition).toArray();

      // TODO record look at position from x y angles + distance
      var lookatPosition = new THREE.Vector3( 0, 0, -1 * this.lookatDistance ).applyQuaternion( camera.quaternion ).add( camera.position );
      var lookatGeo = SceneService.toGeo(lookatPosition).toArray();

      this.waypoints.push(cameraPositionGeo.concat(lookatGeo));
      this.waypointsChanged();
    };

    this.getCameraAndLookatLocation = function () {
      var camera = CameraService.camera;
      var cameraPosition = camera.position.clone();

      var lookatPosition = new THREE.Vector3( 0, 0, -1 * this.lookatDistance ).applyQuaternion( camera.quaternion ).add( camera.position );

      var cameraPositionGeo = SceneService.toGeo(cameraPosition).toArray();
      var lookatGeo = SceneService.toGeo(lookatPosition).toArray();

      return {cameraPosition: cameraPositionGeo, lookatPosition: lookatGeo};
    };

    this.removeLast = function() {
      this.waypoints.pop();
      this.waypointsChanged();
    };

    this.waypointsChanged = function() {
      this.updateSplines();
      this.updateRailScene();
      this.updateDataUrl();
    };

    this.updateSplines = function() {
      // curve.getSpacedPoints requires at least 2 waypoints
      if (this.waypoints.length < 2) {
        return;
      }

      var cameraWaypoints = this.waypoints.map(function(coord) {
        return SceneService.toLocal(new THREE.Vector3(coord[0], coord[1], coord[2]));
      });
      var cameraWaypointCurve = new THREE.SplineCurve3(cameraWaypoints);
      this.cameraCurve = new THREE.SplineCurve3(
        cameraWaypointCurve.getSpacedPoints(this.curveSegments)
      );

      var lookatWaypoints = this.waypoints.map(function(coord) {
        return SceneService.toLocal(new THREE.Vector3(coord[3], coord[4], coord[5]));
      });
      var lookatWaypointsCurve = new THREE.SplineCurve3(lookatWaypoints);
      this.lookatCurve = new THREE.SplineCurve3(
        lookatWaypointsCurve.getSpacedPoints(this.curveSegments)
      );
    };

    /**
     * Camera position of first waypoint
     *
     * @return {THREE.Vector3}
     */
    this.firstCameraPosition = function() {
      return this.cameraCurve.getPointAt(0);
    };

    /**
     * Look at position of first waypoint
     *
     * @return {THREE.Vector3}
     */
    this.firstLookatPosition = function() {
      return this.lookatCurve.getPointAt(0);
    };

    this.setWaypoints = function(waypoints) {
      this.waypoints = angular.copy(waypoints);
      this.waypointsChanged();
    };

    this.setCameraAndLookAtWaypoints = function(cameraWaypoints, lookatWaypoints) {
      this.waypoints = [];
      for (var i = 0; i < cameraWaypoints.length; i++) {
        this.waypoints.push(cameraWaypoints[i].concat(lookatWaypoints[i]));
      }
      this.waypointsChanged();
    };

    this.updateRailScene = function() {
      // restore visibility after recreation
      var visible = this.scene.visible;
      SceneService.getScene().remove(this.scene);
      this.createRailScene();
      this.scene.visible = visible;
    };

    this.createRailScene = function() {
      this.scene = new THREE.Object3D();
      this.scene.name = 'rail';
      this.scene.visible = false;

      // tube requires at least 2 waypoints
      if (this.waypoints.length >= 2) {
        var ctube = this.createTube(this.cameraCurve, 'camera', 0x00ffff, 0xff0000);
        this.scene.add(ctube);
        var ltube = this.createTube(this.lookatCurve, 'lookat', 0x00ffff, 0x00ff00);
        this.scene.add(ltube);
      }

      SceneService.getScene().add(this.scene);
    };

    this.createTube = function(curve, name, tubeColor, ballColor) {
      var tube = new THREE.TubeGeometry(curve, 1024, 0.25, 8, false);
      var tubeMesh = THREE.SceneUtils.createMultiMaterialObject(tube, [
        new THREE.MeshLambertMaterial({
          color: tubeColor
        }),
        new THREE.MeshBasicMaterial({
          color: tubeColor,
          opacity: 0.3,
          wireframe: false,
          transparent: false
        })
      ]);
      tubeMesh.name = name;

      var sphereGeo = new THREE.SphereGeometry(0.5, 32, 32);
  		var meshMat = new THREE.MeshBasicMaterial({color: ballColor});
      curve.points.map(function(point) {
        var sphere = new THREE.Mesh(sphereGeo, meshMat);
  			sphere.position.copy(point);
  			tubeMesh.add(sphere);
      }.bind(this));

      return tubeMesh;
    };

    this.updateDataUrl = function() {
      var data = JSON.stringify(this.waypoints);
      var blob = new Blob([data], {
        type: 'application/json'
      });
      if (this.dataUrl) {
        $window.URL.revokeObjectURL(this.dataUrl);
      }
      this.dataUrl = $window.URL.createObjectURL(blob);
    };

    this.onFileUpload = function(event) {
      if (this.filereader.readyState === FileReader.DONE) {
        this.setWaypoints(JSON.parse(event.target.result));
        toastr.success('Upload of demo waypoints completed');
      } else {
        toastr.error('Upload of demo waypoints failed');
      }
    };

    this.upload = function(files) {
      if (files.length < 1) {
        return;
      }
      var theFile = files[0];
      this.filereader.readAsText(theFile);
    };

    this.clear = function() {
      this.waypoints = [];
      this.waypointsChanged();
    };

    this.filereader = new FileReader();
    this.filereader.onloadend = this.onFileUpload.bind(this);
    this.filereader.onerror = function() {
      toastr.error('Upload of demo waypoints failed');
    };

    this.createRailScene();
    this.updateDataUrl();
  }

  angular.module('pattyApp.pointcloud')
    .service('RailService', RailService);
})();
