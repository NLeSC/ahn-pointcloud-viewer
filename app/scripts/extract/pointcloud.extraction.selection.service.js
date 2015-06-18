(function() {
  'use strict';

  function PointcloudExtractionSelectionService(THREE, SceneService) {
    this.color = new THREE.Color( 0xffffff );
    var edges = [];

    this.init = function(scene, camera, renderer) {
    	this.scene = scene;
    	this.camera = camera;
    	this.renderer = renderer;
    };

    this.buildSelectionGeometry = function(zCoord) {
      var leftTopLocal     = SceneService.toLocal({x:this.selection.left,  y: this.selection.top, z:zCoord});
      var rightTopLocal    = SceneService.toLocal({x:this.selection.right, y: this.selection.top, z:zCoord});
      var rightBottomLocal = SceneService.toLocal({x:this.selection.right, y: this.selection.bottom, z:zCoord});
      var leftBottomLocal  = SceneService.toLocal({x:this.selection.left,  y: this.selection.bottom, z:zCoord});

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
          lineGeometry.colors.push(this.color, this.color, this.color);
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
    };

  	this.raycast = function(raycaster, intersects) {
  		for(var i = 0; i < this.points.length; i++){
  			var sphere = this.spheres[i];

  			sphere.raycast(raycaster, intersects);
  		}

  		// recalculate distances because they are not necessarely correct
  		// for scaled objects.
  		// see https://github.com/mrdoob/three.js/issues/5827
  		// TODO: remove this once the bug has been fixed
  		for(var j= 0; j < intersects.length; i++){
  			var I = intersects[j];
  			I.distance = raycaster.ray.origin.distanceTo(I.point);
  		}

  		intersects.sort( function ( a, b ) { return a.distance - b.distance;} );
  	};

    var scope = this;

    function onMouseDown(event){
  		if(event.which === 1){

  			if(state !== STATE.DEFAULT){
  				event.stopImmediatePropagation();
  			}

  			var I = getHoveredElement();

  			if(I){

  				scope.dragstart = {
  					object: I.object,
  					sceneClickPos: I.point,
  					sceneStartPos: scope.sceneRoot.position.clone(),
  					mousePos: {x: scope.mouse.x, y: scope.mouse.y}
  				};

  				event.stopImmediatePropagation();
  			}

  		}else if(event.which === 3){
  			onRightClick(event);
  		}
  	}

  	function onMouseMove(event){
  		var rect = scope.domElement.getBoundingClientRect();
  		scope.mouse.x = ((event.clientX - rect.left) / scope.domElement.clientWidth) * 2 - 1;
          scope.mouse.y = -((event.clientY - rect.top) / scope.domElement.clientHeight) * 2 + 1;

  		if(scope.dragstart){
  			var arg = {
  				type: "drag",
  				event: event,
  				tool: scope
  			};
  			scope.dragstart.object.dispatchEvent(arg);

  		}else if(state === STATE.INSERT && scope.activeMeasurement){
  			var I = scope.getMousePointCloudIntersection();

  			if(I){

  				var lastIndex = scope.activeMeasurement.points.length-1;
  				scope.activeMeasurement.setPosition(lastIndex, I);
  			}

  		} else if (state === STATE.DEFAULT || state === STATE.INSERT && !scope.activeMeasurement){
  			var I = getHoveredElement();

  			if(I){

  				I.object.dispatchEvent({type: "move", target: I.object, event: event});

  				if(scope.hoveredElement && scope.hoveredElement !== I.object){
  					scope.hoveredElement.dispatchEvent({type: "leave", target: scope.hoveredElement, event: event});
  				}

  				scope.hoveredElement = I.object;

  			}else{

  				if(scope.hoveredElement){
  					scope.hoveredElement.dispatchEvent({type: "leave", target: scope.hoveredElement, event: event});
  				}

  				scope.hoveredElement = null;

  			}
  		}
  	}

  	function onMouseUp(event) {
  		if(scope.dragstart){
  			scope.dragstart.object.dispatchEvent({type: "drop", event: event});
  			scope.dragstart = null;
  		}
  	}

  	this.domElement.addEventListener( 'mousemove', onMouseMove, false );
  	this.domElement.addEventListener( 'mousedown', onMouseDown, false );
  	this.domElement.addEventListener( 'mouseup', onMouseUp, true );

  }

  angular.module('pattyApp.extract').service('PointcloudExtractionSelectionService', PointcloudExtractionSelectionService);
})();
