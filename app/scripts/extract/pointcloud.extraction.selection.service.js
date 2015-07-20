(function() {
  'use strict';

  function PointcloudExtractionSelectionService(THREE, SceneService, ExtractionSelectionService, Messagebus, Potree) {
    var me = this;

    this.selectionActive = false;
    this.topRightPoint = null;
    this.bottomLeftPoint = null;

    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.mesh = null;

	  this.mouse = {x: 0, y: 0};

    this.init = function(renderer, scene, camera) {
      this.renderer = renderer;
      this.scene = scene;
      this.camera = camera;

      me.renderer.domElement.addEventListener( 'mousemove', onMouseMove, false );
    	me.renderer.domElement.addEventListener( 'mousedown', onMouseDown, false );
    	me.renderer.domElement.addEventListener( 'mouseup', onMouseUp, true );
    };

    this.getMousePointCloudIntersection = function(){
  		var vector = new THREE.Vector3( me.mouse.x, me.mouse.y, 0.5 );
  		vector.unproject(me.camera);
  		var direction = vector.sub(me.camera.position).normalize();
  		var ray = new THREE.Ray(me.camera.position, direction);

  		var pointClouds = [];
  		me.scene.traverse(function(object){
  			if(object instanceof Potree.PointCloudOctree){
  				pointClouds.push(object);
  			}
  		});

  		var closestPoint = null;
  		var closestPointDistance = null;

  		for(var i = 0; i < pointClouds.length; i++){
  			var pointcloud = pointClouds[i];
  			var point = pointcloud.pick(me.renderer, me.camera, ray, {accuracy: 0.5});

  			if(!point){
  				continue;
  			}

  			var distance = me.camera.position.distanceTo(point.position);

  			if(!closestPoint || distance < closestPointDistance){
  				closestPoint = point;
  				closestPointDistance = distance;
  			}
  		}

  		return closestPoint ? closestPoint.position : null;
  	}

    var scope = this;

    function onMouseDown(event){
      if(me.selectionActive) {
        if(event.which === 1) {
          var I = scope.getMousePointCloudIntersection();
          console.log('Down!');
          console.log(I);

    			if(I){
    				me.topRightPoint = SceneService.toGeo(I);
            console.log(me.topRightPoint);
    			}
        }
      }
  	}

  	function onMouseUp(event) {
      if(me.selectionActive) {
        if(event.which === 1) {
          var I = scope.getMousePointCloudIntersection();
          console.log('Up!');
          console.log(I);

    			if(I){
    				me.bottomLeftPoint = SceneService.toGeo(I);
            console.log(me.bottomLeftPoint);

            var topRight = {lat:me.topRightPoint.y, lon:me.topRightPoint.x};
            var bottomLeft = {lat:me.bottomLeftPoint.y, lon:me.bottomLeftPoint.x};

            ExtractionSelectionService.setTopRightCoordinates(topRight);
            ExtractionSelectionService.setBottomLeftCoordinates(bottomLeft);
    			}
        }
      }
  	}

    function onMouseMove(event){
  		me.mouse.x = ( event.clientX / me.renderer.domElement.clientWidth ) * 2 - 1;
  		me.mouse.y = - ( event.clientY / me.renderer.domElement.clientHeight ) * 2 + 1;
  	}

    this.activationChanged = function(event, active) {
      this.selectionActive = active;
    };

    Messagebus.subscribe('extractionSelectionActivationChanged', this.activationChanged.bind(this));

  }

  angular.module('pattyApp.extract').service('PointcloudExtractionSelectionService', PointcloudExtractionSelectionService);
})();
