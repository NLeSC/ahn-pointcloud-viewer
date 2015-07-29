(function() {
  'use strict';

  function ExtractionDrawingService(THREE, SceneService, Messagebus) {
    this.color = new THREE.Color(0xffffff);

    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.selectionMesh = null;
    this.intermediateMesh = null;

    this.init = function(renderer, scene, camera) {
      this.renderer = renderer;
      this.scene = scene;
      this.camera = camera;
    };

    this.remoteSelectionChanged = function(event, bbox) {
      this.scene.remove(this.selectionMesh);

      var leftTopLocal = SceneService.toLocal(new THREE.Vector3(bbox.left, bbox.top, 0));
      var rightTopLocal = SceneService.toLocal(new THREE.Vector3(bbox.right, bbox.top, 0));
      var rightBottomLocal = SceneService.toLocal(new THREE.Vector3(bbox.right, bbox.bottom, 0));
      var leftBottomLocal = SceneService.toLocal(new THREE.Vector3(bbox.left, bbox.bottom, 0));

      this.selectionMesh = this.buildSelectionGeometry(leftTopLocal, rightTopLocal, rightBottomLocal, leftBottomLocal, 0xFF0000);
      this.scene.add(this.selectionMesh);
    };

    Messagebus.subscribe('extractionSelectionChanged', this.remoteSelectionChanged.bind(this));

    this.setIntermediate = function(mouseDownPoint, mouseMovePoint) {
      this.scene.remove(this.selectionMesh);
      this.scene.remove(this.intermediateMesh);

      var leftTopLocal = new THREE.Vector3(mouseDownPoint.x, 0, mouseDownPoint.z);
      var rightTopLocal = new THREE.Vector3(mouseMovePoint.x, 0, mouseDownPoint.z);
      var rightBottomLocal = new THREE.Vector3(mouseMovePoint.x, 0, mouseMovePoint.z);
      var leftBottomLocal = new THREE.Vector3(mouseDownPoint.x, 0, mouseMovePoint.z);

      this.intermediateMesh = this.buildSelectionGeometry(leftTopLocal, rightTopLocal, rightBottomLocal, leftBottomLocal, 0xFF0000);
      this.scene.add(this.intermediateMesh);
    };

    this.removeIntermediate = function() {
      this.scene.remove(this.intermediateMesh);
    };

    this.buildSelectionGeometry = function(leftTopLocal, rightTopLocal, rightBottomLocal, leftBottomLocal, color) {
      var boxMaterial = new THREE.MeshBasicMaterial({
        color: color,
        side: THREE.DoubleSide,
        transparent: true,
        wireframe: false,
        opacity: 1
          // overdraw: 0.5
      });

      var geometry = new THREE.Geometry();
      var translationMatrix = null;

      var topBox = new THREE.BoxGeometry(rightTopLocal.x-leftTopLocal.x+200, 100, 100);
      translationMatrix = new THREE.Matrix4().setPosition(new THREE.Vector3(leftTopLocal.x+ 0.5*(rightTopLocal.x-leftTopLocal.x), 45, leftTopLocal.z+50));
      topBox.applyMatrix(translationMatrix);

      var rightBox = new THREE.BoxGeometry(100, 100, rightTopLocal.z-rightBottomLocal.z+200);
      translationMatrix = new THREE.Matrix4().setPosition(new THREE.Vector3(rightBottomLocal.x+50, 45, rightBottomLocal.z+0.5*(rightTopLocal.z-rightBottomLocal.z)));
      rightBox.applyMatrix(translationMatrix);

      var bottomBox = new THREE.BoxGeometry(rightBottomLocal.x-leftBottomLocal.x+200, 100, 100);
      translationMatrix = new THREE.Matrix4().setPosition(new THREE.Vector3(leftBottomLocal.x+ 0.5*(rightBottomLocal.x-leftBottomLocal.x), 45, leftBottomLocal.z-50));
      bottomBox.applyMatrix(translationMatrix);

      var leftBox = new THREE.BoxGeometry(100, 100, leftTopLocal.z-leftBottomLocal.z+200);
      translationMatrix = new THREE.Matrix4().setPosition(new THREE.Vector3(leftTopLocal.x-50, 45, leftBottomLocal.z+0.5*(leftTopLocal.z-leftBottomLocal.z)));
      leftBox.applyMatrix(translationMatrix);

      THREE.GeometryUtils.merge(geometry, topBox);
      THREE.GeometryUtils.merge(geometry, rightBox);
      THREE.GeometryUtils.merge(geometry, bottomBox);
      THREE.GeometryUtils.merge(geometry, leftBox);

      var mesh = new THREE.Mesh(geometry, boxMaterial);
      return mesh;
    };

    this.activationChanged = function(event, active) {
      if (active) {
        if (this.selectionMesh !== null) {
          this.scene.add(this.selectionMesh);
        }
        if (this.intermediateMesh !== null) {
          this.scene.add(this.intermediateMesh);
        }
        this.show = true;
      } else {
        this.scene.remove(this.selectionMesh);
        this.scene.remove(this.intermediateMesh);
        this.show = false;
      }
    };

    Messagebus.subscribe('extractionSelectionActivationChanged', this.activationChanged.bind(this));

  }

  angular.module('pattyApp.extract').service('ExtractionDrawingService', ExtractionDrawingService);
})();
