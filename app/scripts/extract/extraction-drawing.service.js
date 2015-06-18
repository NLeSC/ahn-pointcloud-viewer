(function() {
  'use strict';

  function ExtractionDrawingService(THREE, SceneService) {
    this.color = new THREE.Color( 0xffffff );

    var edges = [];
  
    this.init = function(scene, camera, renderer) {
    	this.scene = scene;
    	this.camera = camera;
    	this.renderer = renderer;
    };

    function buildSelectionGeometry(zCoord) {
      var leftTopLocal     = SceneService.toLocal({x:scope.selection.left,  y: scope.selection.top, z:zCoord});
      var rightTopLocal    = SceneService.toLocal({x:scope.selection.right, y: scope.selection.top, z:zCoord});
      var rightBottomLocal = SceneService.toLocal({x:scope.selection.right, y: scope.selection.bottom, z:zCoord});
      var leftBottomLocal  = SceneService.toLocal({x:scope.selection.left,  y: scope.selection.bottom, z:zCoord});

      var points = [];

      points.add(leftTopLocal);
      points.add(rightTopLocal);
      points.add(rightBottomLocal);
      points.add(leftBottomLocal);

      var edge, i, i2;

      if (edges.length === 0) {
        for (i = 0; i < points.length; i++) {
          var lineGeometry = new THREE.Geometry();
          lineGeometry.vertices.push(new THREE.Vector3(), new THREE.Vector3());
          lineGeometry.colors.push(scope.color, scope.color, scope.color);
          var lineMaterial = new THREE.LineBasicMaterial( {
            linewidth: 1
          });
          lineMaterial.depthTest = false;
          edge = new THREE.Line(lineGeometry, lineMaterial);

          edges.add(edge);
        }
      }

      for (i = 0; i < points.length; i++) {
        i2 = i+1;
        if (i2 > points.length) {
          i2 = 0;
        }
        edge = edges[i];

        edge.geometry.vertices[0].copy(points[i]);
        edge.geometry.vertices[1].copy(points[i2]);

        edge.geometry.verticesNeedUpdate = true;
        edge.geometry.computeBoundingSphere();

        edge.visible = true;
      }
    }

  }

  angular.module('pattyApp.extract').service('ExtractionDrawingService', ExtractionDrawingService);
})();
