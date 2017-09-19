(function() {
  'use strict';

  function EarthcontrolsService(Messagebus, THREE, PathControls) {
    this.enabled = true;

    this.earthControls = null;
    this.pathcontrols = PathControls;

    this.elementRenderArea = null;

    var clock = new THREE.Clock();

    this.init = function(camera, renderer, scene, scenePointCloud, pointcloud, elementRenderArea)  {
      this.earthControls = new THREE.EarthControls(camera, renderer, scenePointCloud);
      // this.earthControls = new Potree.EarthControls(scene);

    	// this.earthControls.addEventListener('proposeTransform', function(event) {
    		// var demHeight = pointcloud.getDEMHeight(event.newPosition);
    		// if(event.newPosition.y < demHeight){
    		// 	event.objections++;
    		// }
    	// });

      this.earthControls.pointclouds.push(pointcloud);

      if (this.enabled) {
        this.pathcontrols.disable();
      } else {
        this.pathcontrols.enable();
      }

      this.elementRenderArea = elementRenderArea;
      this.elementRenderArea.addEventListener('mousedown', this.mousedown.bind(this), false);
    };

    this.update = function() {
      if(this.enabled) {
		    this.earthControls.update(clock.getDelta());
      }
    };

    this.mousedown = function() {
			// claim focus when right click on canvas and not yet focused
			if (document.activeElement !== this.elementRenderArea) {
				 this.elementRenderArea.focus();
			}
    };

    Messagebus.subscribe('earthcontrols suspended', function(event, value) {
      this.earthControls.enabled = !value;
    }.bind(this));

    Messagebus.subscribe('earthcontrols enabled', function(event, value) {
      this.enabled = value;

      if (value) {
        this.pathcontrols.disable();
      } else {
        this.pathcontrols.enable();
      }

      this.earthControls.enabled = value;
    }.bind(this));
  }

  angular.module('pattyApp.earthcontrols').service('EarthcontrolsService', EarthcontrolsService);
})();
