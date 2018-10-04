(function() {
  'use strict';

  function EarthcontrolsService($rootScope, $location, Messagebus, THREE, PathControls, RailService) { // jshint ignore:line
    this.enabled = true;

    this.earthControls = null;
    this.pathcontrols = PathControls;

    this.elementRenderArea = null;

    var clock = new THREE.Clock();

    this.init = function(camera, renderer, scenePointCloud, pointcloud, elementRenderArea)  {
      this.earthControls = new THREE.EarthControls(camera, renderer, scenePointCloud);

    	this.earthControls.addEventListener('proposeTransform', function() {
    		// var demHeight = pointcloud.getDEMHeight(event.newPosition);
    		// if(event.newPosition.y < demHeight){
    		// 	event.objections++;
    		// }
    	});

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

      /* jshint ignore:start */
      var waypoint = RailService.getCameraAndLookatLocation();

      //store camera values in the URL
      $location.search({
        camera_x:waypoint.cameraPosition[0],
        camera_y:waypoint.cameraPosition[1],
        camera_z:waypoint.cameraPosition[2],
        lookat_x:waypoint.lookatPosition[0],
        lookat_y:waypoint.lookatPosition[1],
        lookat_z:waypoint.lookatPosition[2]
      }).replace();
      /* jshint ignore:end */

      $rootScope.$applyAsync();
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
