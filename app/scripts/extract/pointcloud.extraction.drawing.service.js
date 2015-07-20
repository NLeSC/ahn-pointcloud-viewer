(function() {
  'use strict';

  function ExtractionDrawingService(THREE, SceneService, Messagebus) {
    var SELECTION_WALL_DEPTH = -10;
    var SELECTION_WALL_HEIGHT = 100;

    this.color = new THREE.Color(0xffffff);

    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.mesh = null;

    this.init = function(renderer, scene, camera) {
      this.renderer = renderer;
      this.scene = scene;
      this.camera = camera;
    };

    this.remoteSelectionChanged = function(event, bbox) {
      this.scene.remove(this.mesh);
      this.mesh = this.buildSelectionGeometry(bbox);
      this.scene.add(this.mesh);
    };

    Messagebus.subscribe('extractionSelectionChanged', this.remoteSelectionChanged.bind(this));

    this.buildSelectionGeometry = function(bbox) {
      var leftTopLocal = SceneService.toLocal(new THREE.Vector3(bbox.left, bbox.top, 0));
      var rightTopLocal = SceneService.toLocal(new THREE.Vector3(bbox.right, bbox.top, 0));
      var rightBottomLocal = SceneService.toLocal(new THREE.Vector3(bbox.right, bbox.bottom, 0));
      var leftBottomLocal = SceneService.toLocal(new THREE.Vector3(bbox.left, bbox.bottom, 0));

      var boxMaterial = new THREE.MeshBasicMaterial({
        color: 0x00FF00,
        side: THREE.DoubleSide,
        transparent: true,
        wireframe: false,
        opacity: 1
          // overdraw: 0.5
      });

      var geometry = new THREE.Geometry();
      var counter = 0;

      //Top Square
      geometry.vertices.push(new THREE.Vector3(leftTopLocal.x, SELECTION_WALL_DEPTH, leftTopLocal.z));
      geometry.vertices.push(new THREE.Vector3(leftTopLocal.x, SELECTION_WALL_HEIGHT, leftTopLocal.z));
      geometry.vertices.push(new THREE.Vector3(rightTopLocal.x, SELECTION_WALL_DEPTH, rightTopLocal.z));

      geometry.faces.push(new THREE.Face3(counter++, counter++, counter++));

      geometry.vertices.push(new THREE.Vector3(leftTopLocal.x, SELECTION_WALL_HEIGHT, leftTopLocal.z));
      geometry.vertices.push(new THREE.Vector3(rightTopLocal.x, SELECTION_WALL_HEIGHT, rightTopLocal.z));
      geometry.vertices.push(new THREE.Vector3(rightTopLocal.x, SELECTION_WALL_DEPTH, rightTopLocal.z));

      geometry.faces.push(new THREE.Face3(counter++, counter++, counter++));

      //Right Square
      geometry.vertices.push(new THREE.Vector3(rightTopLocal.x, SELECTION_WALL_DEPTH, rightTopLocal.z));
      geometry.vertices.push(new THREE.Vector3(rightTopLocal.x, SELECTION_WALL_HEIGHT, rightTopLocal.z));
      geometry.vertices.push(new THREE.Vector3(rightBottomLocal.x, SELECTION_WALL_DEPTH, rightBottomLocal.z));

      geometry.faces.push(new THREE.Face3(counter++, counter++, counter++));

      geometry.vertices.push(new THREE.Vector3(rightTopLocal.x, SELECTION_WALL_HEIGHT, rightTopLocal.z));
      geometry.vertices.push(new THREE.Vector3(rightBottomLocal.x, SELECTION_WALL_HEIGHT, rightBottomLocal.z));
      geometry.vertices.push(new THREE.Vector3(rightBottomLocal.x, SELECTION_WALL_DEPTH, rightBottomLocal.z));

      geometry.faces.push(new THREE.Face3(counter++, counter++, counter++));


      //Bottom Square
      geometry.vertices.push(new THREE.Vector3(rightBottomLocal.x, SELECTION_WALL_DEPTH, rightBottomLocal.z));
      geometry.vertices.push(new THREE.Vector3(rightBottomLocal.x, SELECTION_WALL_HEIGHT, rightBottomLocal.z));
      geometry.vertices.push(new THREE.Vector3(leftBottomLocal.x, SELECTION_WALL_DEPTH, leftBottomLocal.z));

      geometry.faces.push(new THREE.Face3(counter++, counter++, counter++));

      geometry.vertices.push(new THREE.Vector3(rightBottomLocal.x, SELECTION_WALL_HEIGHT, rightBottomLocal.z));
      geometry.vertices.push(new THREE.Vector3(leftBottomLocal.x, SELECTION_WALL_HEIGHT, leftBottomLocal.z));
      geometry.vertices.push(new THREE.Vector3(leftBottomLocal.x, SELECTION_WALL_DEPTH, leftBottomLocal.z));

      geometry.faces.push(new THREE.Face3(counter++, counter++, counter++));

      //Left Square
      geometry.vertices.push(new THREE.Vector3(leftBottomLocal.x, SELECTION_WALL_DEPTH, leftBottomLocal.z));
      geometry.vertices.push(new THREE.Vector3(leftBottomLocal.x, SELECTION_WALL_HEIGHT, leftBottomLocal.z));
      geometry.vertices.push(new THREE.Vector3(leftTopLocal.x, SELECTION_WALL_DEPTH, leftTopLocal.z));

      geometry.faces.push(new THREE.Face3(counter++, counter++, counter++));

      geometry.vertices.push(new THREE.Vector3(leftBottomLocal.x, SELECTION_WALL_HEIGHT, leftBottomLocal.z));
      geometry.vertices.push(new THREE.Vector3(leftTopLocal.x, SELECTION_WALL_HEIGHT, leftTopLocal.z));
      geometry.vertices.push(new THREE.Vector3(leftTopLocal.x, SELECTION_WALL_DEPTH, leftTopLocal.z));

      geometry.faces.push(new THREE.Face3(counter++, counter++, counter++));

      var mesh = new THREE.Mesh(geometry, boxMaterial);
      return mesh;
    };

    this.activationChanged = function(event, active) {
      if (active && this.mesh !== null) {
        this.scene.add(this.mesh);
        this.show = true;
      } else {
        this.scene.remove(this.mesh);
        this.show = false;
      }
    };

    Messagebus.subscribe('extractionSelectionActivationChanged', this.activationChanged.bind(this));

  }

  angular.module('pattyApp.extract').service('ExtractionDrawingService', ExtractionDrawingService);
})();
