/*
 *  PathControls
 *  by Ben van Werkhoven (Netherlands eScience Center)
 *
 *  free look around with mouse drag
 */

(function() {
	'use strict';

	var camera;
	var clock;
	var drag = false;
	var lookatPathFactor = 1.08;
	var el;

	var bodyPosition;
	var xAngle = 0;
	var yAngle = 0;

	var MAX_YANGLE = 0.95 * Math.PI / 2;
	var MIN_YANGLE = -0.95 * Math.PI / 2;

	var mouseX = window.innerWidth / 2;
	var mouseY = window.innerHeight / 2;

	//	this factor controls mouse sensitivity
	//	should be more than 2*Math.PI to get full rotation
	var factor = 8;

	//	Map for key states
	var keys = [];
	var zoom = 45;
	var maxZoom = 45;
	var positionOnRoad = 0.0;
	var looptime = 240;
	var THREE;
	var RailService;

	var PathControls = function(_THREE_, _RailService_, CameraService) {
		THREE = _THREE_;
		RailService = _RailService_;
		this.NORMAL_MOVEMENT_SPEED_MULTIPLIER = 30;
		this.FAST_MOVEMENT_SPEED_MULTIPLIER = 50;

		for (var i = 0; i < 130; i++) {
			keys.push(false);
		}

		camera = CameraService.camera;

		clock = new THREE.Clock();

		this.modes = {
			ONRAILS: 'onrails',
			FLY: 'fly',
			DEMO: 'demo',
			OFF: 'off'
		};

		this.mode = this.modes.FLY;
	};

	PathControls.prototype.initCamera = function(startPos) {
		camera.position.copy(startPos);
		camera.up.set(0, 1, 0);
		camera.rotation.order = 'YXZ';

		bodyPosition = camera.position;
		zoom = camera.fov;
		maxZoom = camera.fov;
	};

	PathControls.prototype.initListeners = function(element) {
		el = element;
		// make element focusable, see https://developer.mozilla.org/en-US/docs/Web/HTML/Focus_management_in_HTML
		element.setAttribute('tabindex', 1);

		element.addEventListener('keydown', onKeyDown, false);
		element.addEventListener('keyup', onKeyUp, false);

		element.addEventListener('mouseleave', onBlur, false);
		element.addEventListener('mouseout', onBlur, false);

		element.addEventListener('mousemove', mousemove, false);
		element.addEventListener('mousedown', mousedown, false);
		element.addEventListener('mouseup', mouseup, false);

		element.addEventListener('mousewheel', mousewheel, false);
		element.addEventListener('DOMMouseScroll', mousewheel, false); // firefox
	};

	PathControls.prototype.disableListeners = function(element) {
		element.removeEventListener('keydown', onKeyDown, false);
		element.removeEventListener('keyup', onKeyUp, false);

		element.removeEventListener('mouseleave', onBlur, false);
		element.removeEventListener('mouseout', onBlur, false);

		element.removeEventListener('mousemove', mousemove, false);
		element.removeEventListener('mousedown', mousedown, false);
		element.removeEventListener('mouseup', mouseup, false);

		element.removeEventListener('mousewheel', mousewheel, false);
		element.removeEventListener('DOMMouseScroll', mousewheel, false); // firefox
	};

	PathControls.prototype.init = function(element) {
    this.initCamera(RailService.firstCameraPosition());

		this.lookat(RailService.firstLookatPosition());
		camera.updateProjectionMatrix();

		this.initListeners(element);
	};

	function findNearestPointOnPath(path, point) {
		//first find nearest point on road
		var minDist = Number.MAX_VALUE;
		var dist = 0;
		var index = 0;
		var i;
		for (i=0; i < path.points.length; i++) {
			dist = point.distanceTo(path.points[i]);
			if (dist < minDist) {
				minDist = dist;
				index = i;
			}
		}

		return index;
	}

	function findPrecisePositionOnPath(cpath, point) {
		//first find nearest point on road
		var index = findNearestPointOnPath(cpath, point);

		//interpolate to find precise positionOnRoad
		//first find second nearest point on the road
		var distOne = Number.MAX_VALUE;
		var distTwo = Number.MAX_VALUE;
		var secondIndex = 1;
		if (index !== 0) {
			distOne = point.distanceTo(cpath.points[index-1]);
		}
		if (index < cpath.points.length-1) {
			distTwo = point.distanceTo(cpath.points[index+1]);
		}
		if (distOne > distTwo) {
			secondIndex = index+1;
		} else {
			index = index-1;
			secondIndex = index+1;
		}
		//interpolate using dot product of vector A and B

		//vector A is the vector from index to point
		var A = point.clone();
		A.sub(cpath.points[index]);

		//vector B is the vector from index to secondIndex
		var B = cpath.points[secondIndex].clone();
		B.sub(cpath.points[index].clone());
		B.normalize();

		//project vector A onto vector B
		var delta = A.dot(B) / A.length();

		//delta = delta / B.length();

		//compute new position on road
		return ((index + delta) / cpath.points.length) * looptime;
	}

	//go to a point on the road near the specified point
	PathControls.prototype.goToPointOnRoad = function(point) {
		//find position on road
		var path = RailService.cameraCurve;
		positionOnRoad = findPrecisePositionOnPath(path, point);

		//move the camera there
		bodyPosition.copy(path.getPointAt(positionOnRoad / looptime));
	};

	PathControls.prototype.lookat = function(center) {
		camera.up = new THREE.Vector3(0,1,0);
		camera.lookAt(center);

		xAngle = camera.rotation.y;
		yAngle = camera.rotation.x;
	};

	PathControls.prototype.moveTo = function(center) {
		bodyPosition.copy(center);
	};

	function cap(value) {
		return Math.min(Math.max(value, 0), 1);
	}

	function moveStep(step) {
		var vec = new THREE.Vector3(Math.sin(xAngle), Math.sin(-yAngle), Math.cos(xAngle));
		return vec.multiplyScalar(-step);
	}

	function strafeStep(step) {
		var vec = new THREE.Vector3(Math.cos(-xAngle), 0.0, Math.sin(-xAngle));
		return vec.multiplyScalar(-step);
	}

	function updateCameraRotation() {
		yAngle = Math.max(Math.min(yAngle,MAX_YANGLE),MIN_YANGLE);
 		camera.rotation.set(yAngle, xAngle, 0, 'YXZ');
	}

	function updateOnRailsMode(delta) {
		// Forward/backward on the rails
		if (keys[87] || keys[38]) { // W or UP
			positionOnRoad += delta;
		}
		if (keys[83] || keys[40]) { // S or DOWN
			positionOnRoad -= delta;
		}

		positionOnRoad = positionOnRoad % looptime;
		//javascript modulus operator allows negative numbers, correct for that
		if (positionOnRoad < 0) {
			positionOnRoad = looptime + positionOnRoad;
		}

		var path = RailService.cameraCurve;
		camera.position.copy(path.getPointAt(positionOnRoad / looptime));
	}

	function updateForwardBackward(step) {
		// Forward/backward
		if (keys[87] || keys[119] || keys[38]) { // W or UP
			bodyPosition.add(moveStep(step));
		}
		if (keys[83] || keys[115] || keys[40]) { // S or DOWN
			bodyPosition.sub(moveStep(step));
		}
	}

	function updateUpDown(step) {
		// Fly up or down
		if (keys[90] || keys[122]) { // Z
			bodyPosition.y -= step;
		}
		if (keys[81] || keys[113]) { // Q
			bodyPosition.y += step;
		}
	}

	function updateStrafe(vec) {
		// Strafe
		if (keys[65] || keys[97] || keys[37]) { // A or left
			bodyPosition.add(vec);
		}
		if (keys[68] || keys[100] || keys[39]) { // D or right
			bodyPosition.sub(vec);
		}
	}

	function updateFlyMode(step) {
		updateForwardBackward(step);

		updateUpDown(step);

		updateStrafe(strafeStep(step));
	}

	function getLocalFactor() {
		var factor = 1;

		//compute the factor that will be used to scale the arclength used to index the lookatpath
		var lookatPath = RailService.lookatCurve;
		var estArcLookPath = findPrecisePositionOnPath(lookatPath, bodyPosition) / lookatPath.points.length;
		var path = RailService.cameraCurve;
		var estArcPath = findPrecisePositionOnPath(path, bodyPosition) / path.points.length;

		//prevent div by zero
		if (estArcPath !== 0 && estArcLookPath !== 0) {
			//divide the larger by the smaller value
			factor = Math.max(estArcPath,estArcLookPath) / Math.min(estArcPath, estArcLookPath);
		}

		return factor;
	}

	PathControls.prototype.updateDemoMode = function(delta) {
		positionOnRoad += delta;
		positionOnRoad = positionOnRoad % looptime;
		//javascript modulus operator allows negative numbers, correct for that
		if (positionOnRoad < 0) {
			positionOnRoad = looptime + positionOnRoad;
		}
		var path = RailService.cameraCurve;
		camera.position.copy(path.getPointAt(positionOnRoad / looptime));

		//slowly adjust the factor over time to the local factor
		lookatPathFactor = (1.0 - delta/3.0) * lookatPathFactor + (delta/3.0) * getLocalFactor();
		//console.log('f=' + lookatPathFactor);

		var lookatPath = RailService.lookatCurve;
		var positionOnLookPath = (positionOnRoad / looptime) * (  lookatPath.getLength() / path.getLength() ) * lookatPathFactor;
		var lookPoint = lookatPath.getPointAt(cap(positionOnLookPath));

		this.lookat(lookPoint);
	};

	PathControls.prototype.updateInput = function() {
		var path = RailService.cameraCurve;
		if (!path) {
			return;
		}

		var delta = clock.getDelta();
		delta *= this.NORMAL_MOVEMENT_SPEED_MULTIPLIER;
		if (keys[32]) {
			delta *= this.FAST_MOVEMENT_SPEED_MULTIPLIER;
		}

		updateCameraRotation();

		if (this.mode === this.modes.DEMO) {
			this.updateDemoMode(delta);
		} else if (this.mode === this.modes.FLY) {
			updateFlyMode(10 * delta);
		} else if (this.mode === this.modes.ONRAILS) {
			updateOnRailsMode(delta);
		} else if (this.mode === this.modes.OFF) {
			//TODO: Implement something else
		} else {
			console.log('error: unknown control mode in path.controls');
		}

	};

	PathControls.prototype.enableFlightMode = function() {
		this.mode = this.modes.FLY;
	};

	PathControls.prototype.transitionFromFlightMode = function() {
		if (this.mode === this.modes.FLY) {
			this.goToPointOnRoad(bodyPosition);
		}
	};

	PathControls.prototype.enableRailsMode = function() {
		this.transitionFromFlightMode();
		this.mode = this.modes.ONRAILS;
	};

	PathControls.prototype.enableDemoMode = function() {
		this.transitionFromFlightMode();
		this.mode = this.modes.DEMO;
	};

	function onKeyDown(event) {
		keys[event.keyCode] = true;

		var spacebarKeyCode = 32;
		if (event.keyCode === spacebarKeyCode) {
			event.preventDefault();
		}
	}

	function onKeyUp(event) {
		keys[event.keyCode] = false;
	}

	//a blur event is fired when we lose focus
	//in such an event we want to turn off all keys
	function onBlur() {
		drag = false;

		var i;
		for (i=0; i < keys.length; i++) {
			keys[i] = false;
		}
	}

	function mousedown(event) {
		//right mouse button going down!!
		if (event.button === 2) {

			// claim focus when right click on canvas and not yet focused
			if (document.activeElement !== el) {
				el.focus();
			}

			event.preventDefault();

			mouseX = event.pageX;
			mouseY = event.pageY;

			drag = true;
		}
	}

	function mouseup(event) {
		//right mouse button going up!!
		if (event.button === 2) {
			event.preventDefault();
			drag = false;
		}
	}

	function mousemove(event) {
		if (!drag) {
			return;
		}

		xAngle -= factor * (event.pageX - mouseX) / (window.innerWidth);
		yAngle -= factor * (event.pageY - mouseY) / (window.innerHeight);

		mouseX = event.pageX;
		mouseY = event.pageY;
	}

	function mousewheel(event) {
		event.preventDefault();
		event.stopPropagation();

		var delta = 0;

		if (event.wheelDelta !== undefined) { // WebKit / Opera / Explorer 9
			delta = event.wheelDelta;
		} else if (event.detail !== undefined) { // Firefox
			delta = -event.detail;
		}

		if (delta < 0) {
			zoom += 2.5;
		} else {
			zoom -= 2.5;
		}

		if (zoom > maxZoom) {
			zoom = maxZoom;
		}
		if (zoom < 5) {
			zoom = 5;
		}

		camera.fov = zoom;
		camera.updateProjectionMatrix();
	}

	  angular.module('pattyApp.pointcloud')
	    .service('PathControls', PathControls);
})();
