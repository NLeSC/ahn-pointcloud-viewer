(function() {
  'use strict';

  function ExtractionDrawingService(THREE, SceneService, Messagebus) {
    this.color = new THREE.Color( 0xffffff );

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
      var leftTopLocal     = SceneService.toLocal(new THREE.Vector3(bbox.left,  bbox.top, 0));
      var rightTopLocal    = SceneService.toLocal(new THREE.Vector3(bbox.right, bbox.top, 0));
      var rightBottomLocal = SceneService.toLocal(new THREE.Vector3(bbox.right, bbox.bottom, 0));
      var leftBottomLocal  = SceneService.toLocal(new THREE.Vector3(bbox.left,  bbox.bottom, 0));

      var boxMaterial = new THREE.MeshBasicMaterial({
        color: 0x00FF00,
        side: THREE.DoubleSide,
        transparent: true,
        wireframe: false,
        opacity: 0.5
        // overdraw: 0.5
      });

      var geometry = new THREE.Geometry();
      var counter = 0;

      //Top Square
      geometry.vertices.push(new THREE.Vector3(leftTopLocal.x,  -10, leftTopLocal.z));
      geometry.vertices.push(new THREE.Vector3(leftTopLocal.x,  300, leftTopLocal.z));
      geometry.vertices.push(new THREE.Vector3(rightTopLocal.x, -10, rightTopLocal.z));

      geometry.faces.push( new THREE.Face3( counter++, counter++, counter++ ) );

      geometry.vertices.push(new THREE.Vector3(leftTopLocal.x,  300, leftTopLocal.z));
      geometry.vertices.push(new THREE.Vector3(rightTopLocal.x, 300, rightTopLocal.z));
      geometry.vertices.push(new THREE.Vector3(rightTopLocal.x, -10, rightTopLocal.z));

      geometry.faces.push( new THREE.Face3( counter++, counter++, counter++ ) );

      //Right Square
      geometry.vertices.push(new THREE.Vector3(rightTopLocal.x,    -10, rightTopLocal.z));
      geometry.vertices.push(new THREE.Vector3(rightTopLocal.x,    300, rightTopLocal.z));
      geometry.vertices.push(new THREE.Vector3(rightBottomLocal.x, -10, rightBottomLocal.z));

      geometry.faces.push( new THREE.Face3( counter++, counter++, counter++ ) );

      geometry.vertices.push(new THREE.Vector3(rightTopLocal.x,    300, rightTopLocal.z));
      geometry.vertices.push(new THREE.Vector3(rightBottomLocal.x, 300, rightBottomLocal.z));
      geometry.vertices.push(new THREE.Vector3(rightBottomLocal.x, -10, rightBottomLocal.z));

      geometry.faces.push( new THREE.Face3( counter++, counter++, counter++ ) );


      //Bottom Square
      geometry.vertices.push(new THREE.Vector3(rightBottomLocal.x, -10, rightBottomLocal.z));
      geometry.vertices.push(new THREE.Vector3(rightBottomLocal.x, 300, rightBottomLocal.z));
      geometry.vertices.push(new THREE.Vector3(leftBottomLocal.x,  -10, leftBottomLocal.z));

      geometry.faces.push( new THREE.Face3( counter++, counter++, counter++ ) );

      geometry.vertices.push(new THREE.Vector3(rightBottomLocal.x, 300, rightBottomLocal.z));
      geometry.vertices.push(new THREE.Vector3(leftBottomLocal.x,  300, leftBottomLocal.z));
      geometry.vertices.push(new THREE.Vector3(leftBottomLocal.x,  -10, leftBottomLocal.z));

      geometry.faces.push( new THREE.Face3( counter++, counter++, counter++ ) );

      //Left Square
      geometry.vertices.push(new THREE.Vector3(leftBottomLocal.x, -10, leftBottomLocal.z));
      geometry.vertices.push(new THREE.Vector3(leftBottomLocal.x, 300, leftBottomLocal.z));
      geometry.vertices.push(new THREE.Vector3(leftTopLocal.x,    -10, leftTopLocal.z));

      geometry.faces.push( new THREE.Face3( counter++, counter++, counter++ ) );

      geometry.vertices.push(new THREE.Vector3(leftBottomLocal.x, 300, leftBottomLocal.z));
      geometry.vertices.push(new THREE.Vector3(leftTopLocal.x,    300, leftTopLocal.z));
      geometry.vertices.push(new THREE.Vector3(leftTopLocal.x,    -10, leftTopLocal.z));

      geometry.faces.push( new THREE.Face3( counter++, counter++, counter++ ) );

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
