/* global requestAnimationFrame:false */
(function() {
  'use strict';

  function PointcloudService(THREE, Potree, POCLoader, $window, $rootScope,
    DrivemapService,
    CameraService, SceneService,
    PathControls, MeasuringService,
    cfpLoadingBar) {

    var me = this;

    this.elRenderArea = null;

    me.settings = {
      pointCountTarget: 5.0,
      pointSize: 0.01,
      opacity: 1,
      showSkybox: true,
      interpolate: true,
      showStats: false,
      highQuality: false,
      showBoundingBox: false,
      pointSizeType: Potree.PointSizeType.ADAPTIVE,
      pointSizeTypes: Potree.PointSizeType,
      pointColorType: Potree.PointColorType.HEIGHT,
      pointColorTypes: Potree.PointColorType,
      pointShapes: Potree.PointShape,
      pointShape: Potree.PointShape.CIRCLE,
      clipMode: Potree.ClipMode.HIGHLIGHT_INSIDE,
      clipModes: Potree.ClipMode
    };

    me.stats = {
      nrPoints: 0,
      nrNodes: 0,
      sceneCoordinates: {
        x: 0,
        y: 0,
        z: 0
      },
      lasCoordinates: {
        x: 0,
        y: 0,
        z: 0,
        crs: 'unknown'
      }
    };

    this.renderer = null;
    var camera, cameraBG;
    var scene;
    var pointcloud;

    var skybox;

    me.pathMesh = null;

    var referenceFrame = SceneService.referenceFrame;
    var mouse = {
      x: 0,
      y: 0
    };

    this.orbitControls = null;
    this.isInOrbitMode = false;

    var drivemapMaterial = new Potree.PointCloudMaterial();

    function loadSkybox(path) {
      var camera = new THREE.PerspectiveCamera(75, $window.innerWidth / $window.innerHeight, 1, 100000);
      cameraBG = new THREE.Camera();
      var scene = new THREE.Scene();

      var format = '.jpg';
      var urls = [
        path + 'px' + format, path + 'nx' + format,
        path + 'py' + format, path + 'ny' + format,
        path + 'pz' + format, path + 'nz' + format
      ];

      var textureCube = THREE.ImageUtils.loadTextureCube(urls, new THREE.CubeRefractionMapping());

      var shader = THREE.ShaderLib.cube;
      shader.uniforms.tCube.value = textureCube;

      var material = new THREE.ShaderMaterial({
        fragmentShader: shader.fragmentShader,
        vertexShader: shader.vertexShader,
        uniforms: shader.uniforms,
        depthWrite: false,
        side: THREE.BackSide
      }),

      mesh = new THREE.Mesh(new THREE.BoxGeometry(100000, 100000, 100000), material);
      scene.add(mesh);

      return {
        'camera': camera,
        'scene': scene
      };
    }

    function getMousePointCloudIntersection() {
      var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
      vector.unproject(camera);
      var direction = vector.sub(camera.position).normalize();
      var ray = new THREE.Ray(camera.position, direction);

      var pointClouds = [];
      scene.traverse(function(object) {
        if (object instanceof Potree.PointCloudOctree) {
          pointClouds.push(object);
        }
      });

      var closestPoint = null;
      var closestPointDistance = null;

      for (var i = 0; i < pointClouds.length; i++) {
        var pointcloud = pointClouds[i];
        var point = pointcloud.pick(me.renderer, camera, ray, {
          accuracy: 0.5
        });

        if (!point) {
          continue;
        }

        var distance = camera.position.distanceTo(point.position);

        if (!closestPoint || distance < closestPointDistance) {
          closestPoint = point;
          closestPointDistance = distance;
        }
      }

      return closestPoint ? closestPoint.position : null;
    }

    function updateStats() {
      if (me.settings.showStats) {
        if (pointcloud) {
          me.stats.nrPoints = pointcloud.numVisiblePoints;
          me.stats.nrNodes = pointcloud.numVisibleNodes;
        } else {
          me.stats.nrPoints = 'none';
          me.stats.nrNodes = 'none';
        }

        var I = getMousePointCloudIntersection();
        if (I) {
          var sceneCoordinates = I;
          me.stats.sceneCoordinates.x = sceneCoordinates.x.toFixed(2);
          me.stats.sceneCoordinates.y = sceneCoordinates.y.toFixed(2);
          me.stats.sceneCoordinates.z = sceneCoordinates.z.toFixed(2);
          var geoCoordinates = SceneService.toGeo(sceneCoordinates);
          me.stats.lasCoordinates.x = geoCoordinates.x.toFixed(2);
          me.stats.lasCoordinates.y = geoCoordinates.y.toFixed(2);
          me.stats.lasCoordinates.z = geoCoordinates.z.toFixed(2);
        }

        // stats are changed in requestAnimationFrame loop,
        // which is outside the AngularJS $digest loop
        // to have changes to stats propagated to angular, we need to trigger a digest
        $rootScope.$digest();
      }
    }

    function onMouseMove(event) {
      mouse.x = (event.clientX / me.renderer.domElement.clientWidth) * 2 - 1;
      mouse.y = -(event.clientY / me.renderer.domElement.clientHeight) * 2 + 1;
    }

    this.initThree = function() {
      var width = $window.innerWidth;
      var height = $window.innerHeight;

      scene = SceneService.getScene();
      camera = CameraService.camera;

      me.renderer = new THREE.WebGLRenderer();
      me.renderer.setSize(width, height);
      me.renderer.autoClear = false;
      me.renderer.domElement.addEventListener('mousemove', onMouseMove, false);

      MeasuringService.init(me.renderer, scene, camera);

      skybox = loadSkybox('images/skybox/');

      // enable frag_depth extension for the interpolation shader, if available
      me.renderer.context.getExtension('EXT_frag_depth');

      DrivemapService.ready.then(this.loadPointcloud);
    };

    this.loadPointcloud = function() {
      // load pointcloud
      var pointcloudPath = DrivemapService.getPointcloudUrl();
      me.stats.lasCoordinates.crs = DrivemapService.getCrs();

      POCLoader.load(pointcloudPath, function(geometry) {
        pointcloud = new Potree.PointCloudOctree(geometry, drivemapMaterial);

        pointcloud.material.pointSizeType = Potree.PointSizeType.ADAPTIVE;
        pointcloud.material.size = me.settings.pointSize;
        pointcloud.visiblePointsTarget = me.settings.pointCountTarget * 1000 * 1000;

        referenceFrame.add(pointcloud);
        referenceFrame.updateMatrixWorld(true); // doesn't seem to do anything
        // reference frame position to pointcloud position:
        referenceFrame.position.set(-pointcloud.position.x, -pointcloud.position.y, 0);
        // rotates to some unknown orientation:
        referenceFrame.updateMatrixWorld(true);
        // rotates point cloud to align with horizon
        referenceFrame.applyMatrix(new THREE.Matrix4().set(
          1, 0, 0, 0,
          0, 0, 1, 0,
          0, -1, 0, 0,
          0, 0, 0, 1
        ));
        referenceFrame.updateMatrixWorld(true);

        var cameraPath = DrivemapService.getCameraPath().map(
          function(coord) {
            return SceneService.toLocal(new THREE.Vector3(coord[0], coord[1], coord[2]));
          }
        );

        var lookPath = DrivemapService.getLookPath().map(
          function(coord) {
            return SceneService.toLocal(new THREE.Vector3(coord[0], coord[1], coord[2]));
          }
        );

        //var miny = 306740, maxy = 615440, minx = 13420, maxx = 322120;
        var minx = 79692.68, maxx = 96258.93, miny = 383917.51, maxy = 422503.12;
        var worldHeight = 256, worldWidth = 256;

        var leftTop = SceneService.toLocal(new THREE.Vector3(minx, maxy, 0));
        var rightBottom = SceneService.toLocal(new THREE.Vector3(maxx, miny, 0));

        var diffx = rightBottom.x - leftTop.x;
        var diffy = rightBottom.z - leftTop.z;

        console.log(leftTop);
        console.log(rightBottom);

        //var planeGeometry = new THREE.PlaneBufferGeometry( diffx, diffy, worldWidth - 1, worldHeight - 1 );
        //planeGeometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
        //planeGeometry.applyMatrix( new THREE.Matrix4().makeTranslation( leftTop.x+(diffx/2), -50, rightBottom.z-(diffy/2)) );
				//var planeMesh = new THREE.Mesh( planeGeometry, new THREE.MeshBasicMaterial( { color: 0xffff00 } ) );
        //SceneService.addMaximap(planeMesh);
				//scene.add( planeMesh );

        //PathControls.init(camera, myPath, lookPath, me.renderer.domElement);
        PathControls.init(camera, cameraPath, lookPath, me.elRenderArea);

        me.pathMesh = PathControls.createPath();
        scene.add(me.pathMesh);
        me.pathMesh.visible = false; // disabled by default
        MeasuringService.setPointcloud(pointcloud);
      });
    };

    this.disableDrivemap = function() {
      referenceFrame.remove(pointcloud);
    };

    this.enableDrivemap = function() {
      referenceFrame.add(pointcloud);
    };

    this.update = function() {
      if (pointcloud) {
        pointcloud.material.clipMode = me.settings.clipMode;
        pointcloud.material.size = me.settings.pointSize;
        pointcloud.visiblePointsTarget = me.settings.pointCountTarget * 1000 * 1000;
        pointcloud.material.opacity = me.settings.opacity;
        pointcloud.material.pointSizeType = me.settings.pointSizeType;
        pointcloud.material.pointColorType = me.settings.pointColorType;
        pointcloud.material.pointShape = me.settings.pointShape;
        pointcloud.material.interpolate = me.settings.interpolate;
        pointcloud.material.heightMin = 0;
        pointcloud.material.heightMax = 8;
        pointcloud.material.intensityMin = 0;
        pointcloud.material.intensityMax = 65000;
        //pointcloud.material.weighted = true;
        pointcloud.material.minSize = 2;
        pointcloud.showBoundingBox = me.settings.showBoundingBox;

        pointcloud.update(camera, me.renderer);


        // update progress bar
        var progress = pointcloud.visibleNodes.length / pointcloud.visibleGeometry.length;
        if (progress === 1 && cfpLoadingBar.status() < 1){
            cfpLoadingBar.complete();
        } else if (progress < 1){
            cfpLoadingBar.start();
            cfpLoadingBar.set(progress);
        } else if (progress === Infinity && cfpLoadingBar.status() < 1) {
          cfpLoadingBar.complete();
        }
      } else {
        // loading metadata
        cfpLoadingBar.start();
      }

      if (me.isInOrbitMode) {
        me.orbitControls.update();
      } else {
        PathControls.updateInput();
      }

      MeasuringService.update();

      CameraService.update();

      // SceneService.update();

      updateStats();
    };

    this.render = function() {
      if(pointcloud) {
        if(pointcloud.originalMaterial) {
          pointcloud.material = pointcloud.originalMaterial;
        }

        // resize
        var width = $window.innerWidth;
        var height = $window.innerHeight;
        me.renderer.setSize(width, height);

        // render skybox
        if (me.settings.showSkybox) {
          skybox.camera.rotation.copy(camera.rotation);
          me.renderer.render(skybox.scene, skybox.camera);
        }

        // render scene
        me.renderer.render(scene, camera);

        MeasuringService.render();
        // SceneService.render();
      }
    };

    // high quality rendering using splats
		//
		var rtDepth = new THREE.WebGLRenderTarget( 1024, 1024, {
			minFilter: THREE.NearestFilter,
			magFilter: THREE.NearestFilter,
			format: THREE.RGBAFormat,
			type: THREE.FloatType
		} );
		var rtNormalize = new THREE.WebGLRenderTarget( 1024, 1024, {
			minFilter: THREE.LinearFilter,
			magFilter: THREE.NearestFilter,
			format: THREE.RGBAFormat,
			type: THREE.FloatType
		} );

		var sceneNormalize;

		var depthMaterial, weightedMaterial;

		// render with splats
		this.renderHighQuality = function() {
			if(!sceneNormalize){
				sceneNormalize = new THREE.Scene();

				var vsNormalize = document.getElementById('vs').innerHTML;
				var fsNormalize = document.getElementById('fs').innerHTML;

				var uniformsNormalize = {
					depthMap: { type: 't', value: rtDepth },
					texture: { type: 't', value: rtNormalize }
				};

				var materialNormalize = new THREE.ShaderMaterial({
					uniforms: uniformsNormalize,
					vertexShader: vsNormalize,
					fragmentShader: fsNormalize
				});

				var quad = new THREE.Mesh( new THREE.PlaneBufferGeometry(2, 2, 0), materialNormalize);
				quad.material.depthTest = true;
				quad.material.depthWrite = true;
				quad.material.transparent = true;
				sceneNormalize.add(quad);
				sceneNormalize.screenQuad = quad;
			}

			// resize
			if(rtDepth){
				if(rtDepth.width !== $window.innerWidth || rtDepth.height !== $window.innerHeight){
					rtDepth.dispose();
					rtNormalize.dispose();

					rtDepth = new THREE.WebGLRenderTarget( 1024, 1024, {
						minFilter: THREE.NearestFilter,
						magFilter: THREE.NearestFilter,
						format: THREE.RGBAFormat,
						type: THREE.FloatType
					} );
					rtNormalize = new THREE.WebGLRenderTarget( 1024, 1024, {
						minFilter: THREE.LinearFilter,
						magFilter: THREE.NearestFilter,
						format: THREE.RGBAFormat,
						type: THREE.FloatType
					} );

					sceneNormalize.screenQuad.material.uniforms.depthMap.value = rtDepth;
					sceneNormalize.screenQuad.material.uniforms.texture.value = rtNormalize;
				}
			}

			var width = $window.innerWidth;
			var height = $window.innerHeight;
			var aspect = width / height;

			camera.aspect = aspect;
			camera.updateProjectionMatrix();

      me.renderer.setSize(width, height);
			rtDepth.setSize(width, height);
			rtNormalize.setSize(width, height);

      me.renderer.clear();

			skybox.camera.rotation.copy(camera.rotation);
      me.renderer.render(skybox.scene, skybox.camera);
      me.renderer.render(scene, camera);

			if(pointcloud){
				if(!weightedMaterial){
					pointcloud.originalMaterial = pointcloud.material;
					depthMaterial = new Potree.PointCloudMaterial();
					weightedMaterial = new Potree.PointCloudMaterial();
				}

				pointcloud.material = depthMaterial;

				//var bbWorld = Potree.utils.computeTransformedBoundingBox(pointcloud.boundingBox, pointcloud.matrixWorld);

				// get rid of this
				pointcloud.material.size = me.settings.pointSize;
				pointcloud.visiblePointsTarget = me.settings.pointCountTarget * 1000 * 1000;
				pointcloud.material.opacity = me.settings.opacity;
				pointcloud.material.pointSizeType = me.settings.pointSizeType;
				pointcloud.material.pointColorType = Potree.PointColorType.DEPTH;
				pointcloud.material.pointShape = Potree.PointShape.CIRCLE;
				pointcloud.material.interpolate = true;
				pointcloud.material.weighted = false;

				pointcloud.material.minSize = 2;
				pointcloud.material.screenWidth = width;
				pointcloud.material.screenHeight = height;

				pointcloud.update(camera, me.renderer);

        me.renderer.clearTarget( rtDepth, true, true, true );
        me.renderer.clearTarget( rtNormalize, true, true, true );

				//var origType = pointcloud.material.pointColorType;
        me.renderer.render(scene, camera, rtDepth);

				pointcloud.material = weightedMaterial;



				// get rid of this
				pointcloud.material.size = me.settings.pointSize;
				pointcloud.visiblePointsTarget = me.settings.pointCountTarget * 1000 * 1000;
				pointcloud.material.opacity = me.settings.opacity;
				pointcloud.material.pointSizeType = me.settings.pointSizeType;
				pointcloud.material.pointColorType = me.settings.pointColorType;
				pointcloud.material.pointShape = Potree.PointShape.CIRCLE;
				pointcloud.material.interpolate = false;
				pointcloud.material.weighted = true;
				pointcloud.material.minSize = 2;

				pointcloud.material.depthMap = rtDepth;
				pointcloud.material.blendDepth = Math.min(pointcloud.material.spacing, 20);
				pointcloud.update(camera, me.renderer);
				me.renderer.render(scene, camera, rtNormalize);


        me.renderer.render(sceneNormalize, cameraBG);


        me.renderer.clearDepth();

        MeasuringService.render();
			}
		}

    this.loop = function() {
      requestAnimationFrame(me.loop);

      me.update();

			if(me.settings.highQuality) {
        me.renderHighQuality();
			}else{
				me.render();
			}
    };

    this.attachCanvas = function(el) {
      me.elRenderArea = el;
      me.initThree();
      var canvas = me.renderer.domElement;
      el.appendChild(canvas);
      me.loop();
    };
  }

  angular.module('pattyApp.pointcloud')
    .service('PointcloudService', PointcloudService);
})();
