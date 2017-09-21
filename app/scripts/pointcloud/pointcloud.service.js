/* global requestAnimationFrame:false */
(function() {
  'use strict';

  function PointcloudService(THREE, Potree, $window, $rootScope, $location,
    DrivemapService,
    CameraService, SceneService,
    PathControls, MeasuringService, EarthcontrolsService,
    RailService, ExtractionDrawingService, PointcloudExtractionSelectionService,
    cfpLoadingBar, Messagebus, GradientsService) {

    var QUALITIES = { Splats:'Splats', Low:'Circle' };

    var me = this;

    this.elRenderArea = null;

    me.settings = {
      pointCountTarget: 2.5,
      pointSize: 2.00,
      opacity: 1,
      showSkybox: false,
      interpolate: false,
      showStats: false,
      highQuality: false,
      showBoundingBox: false,

      pointColorTypes: Potree.PointColorType,
      clipModes: Potree.ClipMode,
      pointSizeType: Potree.PointSizeType.FIXED,
      pointColorType: Potree.PointColorType.HEIGHT,
      pointShape: Potree.PointShape.SQUARE,
      clipMode: Potree.ClipMode.HIGHLIGHT_INSIDE,
      quality: QUALITIES.Low,
      qualities: QUALITIES,

      useDEMCollisions: false,
      minNodeSize: 100,
      heightMin: -5,
      heightMax: 45,
      useEDL: false
    };

    me.predefinedSettings = {
      'LOW': {
      pointCountTarget: 2.5,
      pointSize: 2.00,
      opacity: 1,
      showSkybox: false,
      interpolate: false,
      showStats: false,
      highQuality: false,
      showBoundingBox: false,

      pointColorTypes: Potree.PointColorType,
      clipModes: Potree.ClipMode,
      pointSizeType: Potree.PointSizeType.FIXED,
      pointColorType: Potree.PointColorType.HEIGHT,
      pointShape: Potree.PointShape.SQUARE,
      clipMode: Potree.ClipMode.HIGHLIGHT_INSIDE,
      quality: QUALITIES.Low,
      qualities: QUALITIES,
      useDEMCollisions: false,
      minNodeSize: 100,
      heightMin: -5,
      heightMax: 45,
      useEDL: false
    },
      'STANDARD': {
      pointCountTarget: 5.0,
      pointSize: 1.00,
      opacity: 1,
      showSkybox: true,
      interpolate: false,
      showStats: false,
      highQuality: false,
      showBoundingBox: false,

      pointColorTypes: Potree.PointColorType,
      clipModes: Potree.ClipMode,
      pointSizeType: Potree.PointSizeType.ATTENUATED,
      pointColorType: Potree.PointColorType.HEIGHT,
      pointShape: Potree.PointShape.CIRCLE,
      clipMode: Potree.ClipMode.HIGHLIGHT_INSIDE,
      quality: QUALITIES.Low,
      qualities: QUALITIES,
      useDEMCollisions: false,
      minNodeSize: 100,
      heightMin: -5,
      heightMax: 45,
      useEDL: false
    },
    'HIGH': {
      pointCountTarget: 5,
      pointSize: 1.00,
      opacity: 1,
      showSkybox: true,
      interpolate: true,
      showStats: false,
      highQuality: true,
      showBoundingBox: false,

      pointColorTypes: Potree.PointColorType,
      clipModes: Potree.ClipMode,
      pointSizeType: Potree.PointSizeType.ATTENUATED,
      pointColorType: Potree.PointColorType.HEIGHT,
      pointShape: Potree.PointShape.CIRCLE,
      clipMode: Potree.ClipMode.HIGHLIGHT_INSIDE,
      quality: QUALITIES.Splats,
      qualities: QUALITIES,
      useDEMCollisions: false,
      minNodeSize: 100,
      heightMin: -5,
      heightMax: 45,
      useEDL: false
    },
    'ULTRA': {
      pointCountTarget: 10,
      pointSize: 0.5,
      opacity: 1,
      showSkybox: true,
      interpolate: true,
      showStats: false,
      highQuality: false,
      showBoundingBox: false,

      pointColorTypes: Potree.PointColorType,
      clipModes: Potree.ClipMode,
      pointSizeType: Potree.PointSizeType.ATTENUATED,
      pointColorType: Potree.PointColorType.HEIGHT,
      pointShape: Potree.PointShape.CIRCLE,
      clipMode: Potree.ClipMode.HIGHLIGHT_INSIDE,
      quality: QUALITIES.Splats,
      qualities: QUALITIES,
      useDEMCollisions: false,
      minNodeSize: 100,
      heightMin: -5,
      heightMax: 45,
      useEDL: true
    }};

    me.settings=me.predefinedSettings.STANDARD;

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

    me.renderer = null;
    var camera;
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

    var directionalLight;

    var drivemapMaterial = new Potree.PointCloudMaterial();
    drivemapMaterial.gradient = Potree.Gradients.VIRIDIS;

    // function loadSkybox(path) {
    //   var camera = new THREE.PerspectiveCamera(75, $window.innerWidth / $window.innerHeight, 1, 100000);
    //   cameraBG = new THREE.Camera();
    //   var scene = new THREE.Scene();
    //
    //   var format = '.jpg';
    //   var urls = [
    //     path + 'px' + format, path + 'nx' + format,
    //     path + 'py' + format, path + 'ny' + format,
    //     path + 'pz' + format, path + 'nz' + format
    //   ];
    //
    //   var textureCube = THREE.ImageUtils.loadTextureCube(urls, new THREE.CubeRefractionMapping());
    //
    //   var shader = THREE.ShaderLib.cube;
    //   shader.uniforms.tCube.value = textureCube;
    //
    //   var material = new THREE.ShaderMaterial({
    //     fragmentShader: shader.fragmentShader,
    //     vertexShader: shader.vertexShader,
    //     uniforms: shader.uniforms,
    //     depthWrite: false,
    //     side: THREE.BackSide
    //   }),
    //
    //   mesh = new THREE.Mesh(new THREE.BoxGeometry(100000, 100000, 100000), material);
    //   scene.add(mesh);
    //
    //   return {
    //     'camera': camera,
    //     'scene': scene
    //   };
    // }

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
	    me.elRenderArea.appendChild(me.renderer.domElement);
      me.renderer.domElement.addEventListener('mousemove', onMouseMove, false);

    	directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    	directionalLight.position.set( 10, 10, 10 );
    	directionalLight.lookAt( new THREE.Vector3(0, 0, 0));
    	scene.add( directionalLight );

    	var light = new THREE.AmbientLight( 0x555555 ); // soft white light
    	scene.add( light );

      MeasuringService.init(me.renderer, scene, camera);

      PointcloudExtractionSelectionService.init(me.renderer, scene, camera);
      ExtractionDrawingService.init(me.renderer, scene, camera);

      skybox = Potree.utils.loadSkybox('images/skybox/');

      // enable frag_depth extension for the interpolation shader, if available
      me.renderer.context.getExtension('EXT_frag_depth');

      DrivemapService.ready.then(this.loadPointcloud);
    };

    this.loadPointcloud = function() {
      // load pointcloud
      var pointcloudPath = DrivemapService.getPointcloudUrl();
      me.stats.lasCoordinates.crs = DrivemapService.getCrs();

      Potree.POCLoader.load(pointcloudPath, function(geometry) {
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

        var location = $location.search();

        if (location.hasOwnProperty('camera_x')) {
          var cameraPos = new THREE.Vector3(parseFloat(location.camera_x), parseFloat(location.camera_y), parseFloat(location.camera_z));
          var lookatPos = new THREE.Vector3(parseFloat(location.lookat_x), parseFloat(location.lookat_y), parseFloat(location.lookat_z));

          var vector = lookatPos.clone();
          vector.sub(cameraPos);

          var cameraPos2 = cameraPos.clone().add(vector);
          var lookatPos2 = lookatPos.clone().add(vector);

          var cameraPathSurrogate = [[cameraPos.x, cameraPos.y, cameraPos.z],[cameraPos2.x, cameraPos2.y, cameraPos2.z]];
          var lookPathSurrogate = [[lookatPos.x, lookatPos.y, lookatPos.z],[lookatPos2.x, lookatPos2.y, lookatPos2.z]]; 
          RailService.setCameraAndLookAtWaypoints(
            cameraPathSurrogate, lookPathSurrogate
          );         
        } else {
          RailService.setCameraAndLookAtWaypoints(
            DrivemapService.getCameraPath(),
            DrivemapService.getLookPath()
          );
        }        

        //var miny = 306740, maxy = 615440, minx = 13420, maxx = 322120;
        // var minx = 79692.68, maxx = 96258.93, miny = 383917.51, maxy = 422503.12;
        // var worldHeight = 256, worldWidth = 256;

        // var leftTop = SceneService.toLocal(new THREE.Vector3(minx, maxy, 0));
        // var rightBottom = SceneService.toLocal(new THREE.Vector3(maxx, miny, 0));

        // var diffx = rightBottom.x - leftTop.x;
        // var diffy = rightBottom.z - leftTop.z;

        //var planeGeometry = new THREE.PlaneBufferGeometry( diffx, diffy, worldWidth - 1, worldHeight - 1 );
        //planeGeometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
        //planeGeometry.applyMatrix( new THREE.Matrix4().makeTranslation( leftTop.x+(diffx/2), -50, rightBottom.z-(diffy/2)) );
				//var planeMesh = new THREE.Mesh( planeGeometry, new THREE.MeshBasicMaterial( { color: 0xffff00 } ) );
        //SceneService.addMaximap(planeMesh);
				//scene.add( planeMesh );


        PathControls.init(me.elRenderArea);

        MeasuringService.setPointcloud(pointcloud);

        EarthcontrolsService.init(camera, me.renderer, scene, pointcloud, me.elRenderArea);

        Messagebus.publish('legendTexture change', Potree.Gradients.VIRIDIS);
      });
    };

    this.disableDrivemap = function() {
      referenceFrame.remove(pointcloud);
    };

    this.enableDrivemap = function() {
      referenceFrame.add(pointcloud);
    };

    var intensityMax = null;
    var heightMin = null;
    var heightMax = null;
    var emptyVector = new THREE.Vector3();
    var updateCounter = 0;


    this.update = function() {
      Potree.pointLoadLimit =  me.settings.pointCountTarget * 2 * 1000 * 1000;

      if (me.settings.useEDL) {
        directionalLight.position.copy(camera.position);
        directionalLight.lookAt(emptyVector.set(0,0,0).addVectors(camera.position, camera.getWorldDirection()));
      }

      if (pointcloud) {
      //   var bbWorld = Potree.utils.computeTransformedBoundingBox(pointcloud.boundingBox, pointcloud.matrixWorld);
      //
      //   if (!intensityMax) {
      //     var root = pointcloud.pcoGeometry.root;
      //     if (root !== null && root.loaded) {
      //       var attributes = pointcloud.pcoGeometry.root.geometry.attributes;
      //       if (attributes.intensity) {
      //         var array = attributes.intensity.array;
      //         var max = 0;
      //         for (var i = 0; i < array.length; i++) {
      //           max = Math.max(array[i]);
      //         }
      //
      //         if (max <= 1) {
      //           intensityMax = 1;
      //         } else if (max <= 256) {
      //           intensityMax = 255;
      //         } else {
      //           intensityMax = max;
      //         }
      //       }
      //     }
      //   }
      //   if (heightMin === null) {
      //     heightMin = bbWorld.min.y;
      //     heightMax = bbWorld.max.y;
      //   }


        pointcloud.material.clipMode = me.settings.clipMode;
        pointcloud.material.heightMin = me.settings.heightMin;
        pointcloud.material.heightMax = me.settings.heightMax;
        pointcloud.material.intensityMin = 0;
        pointcloud.material.intensityMax = 65000;
        pointcloud.showBoundingBox = me.settings.showBoundingBox;
		    pointcloud.generateDEM = me.settings.useDEMCollisions;
		    pointcloud.minimumNodePixelSize = me.settings.minNodeSize;



        // pointcloud.material.size = me.settings.pointSize;
        // pointcloud.visiblePointsTarget = me.settings.pointCountTarget * 1000 * 1000;
        // pointcloud.material.opacity = me.settings.opacity;
        // pointcloud.material.pointSizeType = me.settings.pointSizeType;
        // pointcloud.material.pointColorType = me.settings.pointColorType;
        // pointcloud.material.pointShape = me.settings.pointShape;
        // pointcloud.material.interpolate = me.settings.interpolate;
        // pointcloud.material.minSize = 2;
        //pointcloud.material.weighted = true;

        pointcloud.update(camera, me.renderer);


        // update progress bar
        updateCounter++;
        if (updateCounter > 100) {
          var progress = pointcloud.visibleNodes.length / pointcloud.visibleGeometry.length;
          var prevProgress = cfpLoadingBar.status();
          if (progress === 1 && prevProgress < 1){
            cfpLoadingBar.complete();
          } else if (progress < 1 && progress !== prevProgress){
            cfpLoadingBar.start();
            cfpLoadingBar.set(progress);
          } else if (progress === Infinity && prevProgress < 1) {
            cfpLoadingBar.complete();
          }
          updateCounter = 0;
        }
      } else {
        // loading metadata
        cfpLoadingBar.start();
      }

      // if (me.isInOrbitMode) {
      //   me.orbitControls.update();
      // } else {
      // }

      MeasuringService.update();

      CameraService.update();

      if (pointcloud) {
        if (EarthcontrolsService.enabled ) {
          EarthcontrolsService.update();
        } else {
          PathControls.updateInput();
        }
      }

      // SceneService.update();

      updateStats();
    };

    var PotreeRenderer = function() {
      var resize = function(width, height) {
        var aspect = width / height;

        camera.aspect = aspect;
        camera.updateProjectionMatrix();

        me.renderer.setSize(width, height);
      };

      this.render = function() {
        resize(me.elRenderArea.clientWidth, me.elRenderArea.clientHeight);

        // render skybox
        if (me.settings.showSkybox) {
          skybox.camera.rotation.copy(camera.rotation);
          me.renderer.render(skybox.scene, skybox.camera);
        // } else {
        //   me.renderer.render(sceneBG, cameraBG);
        }

        if (pointcloud) {
          if (pointcloud.originalMaterial) {
            pointcloud.material = pointcloud.originalMaterial;
          }

          // var bbWorld = Potree.utils.computeTransformedBoundingBox(pointcloud.boundingBox, pointcloud.matrixWorld);

          pointcloud.visiblePointsTarget = me.settings.pointCountTarget * 1000 * 1000;
          pointcloud.material.size = me.settings.pointSize;
          pointcloud.material.opacity = me.settings.opacity;
          pointcloud.material.pointColorType = me.settings.pointColorType;
          pointcloud.material.pointSizeType = me.settings.pointSizeType;
          pointcloud.material.pointShape = me.settings.PointShape;
          pointcloud.material.interpolate = me.settings.interpolate;
          pointcloud.material.weighted = false;
          pointcloud.material.gradient = Potree.Gradients.VIRIDIS;
        }

        // render scene
        me.renderer.render(scene, camera);
        // me.renderer.render(scenePointCloud, camera);

        MeasuringService.tools.heightprofile.render();
        MeasuringService.tools.volume.render();
        me.renderer.clearDepth();
        MeasuringService.tools.measuring.render();
        MeasuringService.tools.transformation.render();
      };
    };
    var potreeRenderer = new PotreeRenderer();

    // high quality rendering using splats
    var highQualityRenderer = null;
    var HighQualityRenderer = function() {

      var depthMaterial = null;
      var attributeMaterial = null;
      var normalizationMaterial = null;

      var rtDepth;
      var rtNormalize;

      var initHQSPlats = function() {
        if (depthMaterial !== null) {
          return;
        }

        depthMaterial = new Potree.PointCloudMaterial();
        attributeMaterial = new Potree.PointCloudMaterial();

        depthMaterial.pointColorType = Potree.PointColorType.DEPTH;
        depthMaterial.pointShape = Potree.PointShape.CIRCLE;
        depthMaterial.interpolate = false;
        depthMaterial.weighted = false;
        depthMaterial.minSize = 2;

        attributeMaterial.pointShape = Potree.PointShape.CIRCLE;
        attributeMaterial.gradient = Potree.Gradients.VIRIDIS;
        attributeMaterial.interpolate = false;
        attributeMaterial.weighted = true;
        attributeMaterial.minSize = 2;

        rtDepth = new THREE.WebGLRenderTarget(1024, 1024, {
          minFilter: THREE.NearestFilter,
          magFilter: THREE.NearestFilter,
          format: THREE.RGBAFormat,
          type: THREE.FloatType
        });

        rtNormalize = new THREE.WebGLRenderTarget(1024, 1024, {
          minFilter: THREE.LinearFilter,
          magFilter: THREE.NearestFilter,
          format: THREE.RGBAFormat,
          type: THREE.FloatType
        });

        var uniformsNormalize = {
          depthMap: {
            type: 't',
            value: rtDepth
          },
          texture: {
            type: 't',
            value: rtNormalize
          }
        };

        normalizationMaterial = new THREE.ShaderMaterial({
          uniforms: uniformsNormalize,
          vertexShader: Potree.Shaders['normalize.vs'],
          fragmentShader: Potree.Shaders['normalize.fs']
        });
      };

      var resize = function(width, height) {
        if (rtDepth.width === width && rtDepth.height === height) {
          return;
        }

        rtDepth.dispose();
        rtNormalize.dispose();

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        me.renderer.setSize(width, height);
        rtDepth.setSize(width, height);
        rtNormalize.setSize(width, height);
      };

      // render with splats
      this.render = function(renderer) {

        var width = me.elRenderArea.clientWidth;
        var height = me.elRenderArea.clientHeight;

        initHQSPlats();

        resize(width, height);


        renderer.clear();
        if (me.settings.showSkybox) {
          skybox.camera.rotation.copy(camera.rotation);
          renderer.render(skybox.scene, skybox.camera);
        // } else {
        //   renderer.render(sceneBG, cameraBG);
        }
        renderer.render(scene, camera);

        if (pointcloud) {

          depthMaterial.uniforms.octreeSize.value = pointcloud.pcoGeometry.boundingBox.size().x;
          attributeMaterial.uniforms.octreeSize.value = pointcloud.pcoGeometry.boundingBox.size().x;

          pointcloud.visiblePointsTarget = me.settings.pointCountTarget * 1000 * 1000;
          var originalMaterial = pointcloud.material;

          { // DEPTH PASS
            depthMaterial.size = me.settings.pointSize;
            depthMaterial.pointSizeType = me.settings.pointSizeType;
            depthMaterial.screenWidth = width;
            depthMaterial.screenHeight = height;
            depthMaterial.uniforms.visibleNodes.value = pointcloud.material.visibleNodesTexture;
            depthMaterial.uniforms.octreeSize.value = pointcloud.pcoGeometry.boundingBox.size().x;
            depthMaterial.fov = camera.fov * (Math.PI / 180);
            depthMaterial.spacing = pointcloud.pcoGeometry.spacing;
            depthMaterial.near = camera.near;
            depthMaterial.far = camera.far;
            depthMaterial.heightMin = me.settings.heightMin;
            depthMaterial.heightMax = me.settings.heightMax;
            depthMaterial.uniforms.visibleNodes.value = pointcloud.material.visibleNodesTexture;
            depthMaterial.uniforms.octreeSize.value = pointcloud.pcoGeometry.boundingBox.size().x;
            depthMaterial.bbSize = pointcloud.material.bbSize;
            depthMaterial.treeType = pointcloud.material.treeType;

            scene.overrideMaterial = depthMaterial;
            renderer.clearTarget(rtDepth, true, true, true);
            renderer.render(scene, camera, rtDepth);
            scene.overrideMaterial = null;
          }

          { // ATTRIBUTE PASS
            attributeMaterial.size = me.settings.pointSize;
            attributeMaterial.pointSizeType = me.settings.pointSizeType;
            attributeMaterial.screenWidth = width;
            attributeMaterial.screenHeight = height;
            attributeMaterial.pointColorType = me.settings.pointColorType;
            attributeMaterial.depthMap = rtDepth;
            attributeMaterial.uniforms.visibleNodes.value = pointcloud.material.visibleNodesTexture;
            attributeMaterial.uniforms.octreeSize.value = pointcloud.pcoGeometry.boundingBox.size().x;
            attributeMaterial.fov = camera.fov * (Math.PI / 180);
            attributeMaterial.spacing = pointcloud.pcoGeometry.spacing;
            attributeMaterial.near = camera.near;
            attributeMaterial.far = camera.far;
            attributeMaterial.heightMin = me.settings.heightMin;
            attributeMaterial.heightMax = me.settings.heightMax;
            attributeMaterial.intensityMin = pointcloud.material.intensityMin;
            attributeMaterial.intensityMax = pointcloud.material.intensityMax;
            attributeMaterial.setClipBoxes(pointcloud.material.clipBoxes);
            attributeMaterial.clipMode = pointcloud.material.clipMode;
            attributeMaterial.bbSize = pointcloud.material.bbSize;
            attributeMaterial.treeType = pointcloud.material.treeType;

            scene.overrideMaterial = attributeMaterial;
            renderer.clearTarget(rtNormalize, true, true, true);
            renderer.render(scene, camera, rtNormalize);
            scene.overrideMaterial = null;
          }

          { // NORMALIZATION PASS
            normalizationMaterial.uniforms.depthMap.value = rtDepth;
            normalizationMaterial.uniforms.texture.value = rtNormalize;
            Potree.utils.screenPass.render(renderer, normalizationMaterial);
          }

          pointcloud.material = originalMaterial;

          MeasuringService.tools.volume.render();
          me.renderer.clearDepth();
          MeasuringService.tools.heightprofile.render();
          MeasuringService.tools.measuring.render();
          MeasuringService.tools.transformation.render();
        }


      };
    };



    var edlRenderer = null;
    var EDLRenderer = function() {

      var edlMaterial = null;
      var attributeMaterial = null;

      //var depthTexture = null;

      var rtColor = null;
      // var gl = me.renderer.context;

      var initEDL = function() {
        if (edlMaterial !== null) {
          return;
        }

        //var depthTextureExt = gl.getExtension("WEBGL_depth_texture");

        edlMaterial = new Potree.EyeDomeLightingMaterial();
        attributeMaterial = new Potree.PointCloudMaterial();
        attributeMaterial.gradient = Potree.Gradients.VIRIDIS;

        attributeMaterial.pointShape = Potree.PointShape.CIRCLE;
        attributeMaterial.interpolate = false;
        attributeMaterial.weighted = false;
        // attributeMaterial.minSize = 2;
        attributeMaterial.useLogarithmicDepthBuffer = false;
        attributeMaterial.useEDL = true;

        rtColor = new THREE.WebGLRenderTarget(1024, 1024, {
          minFilter: THREE.LinearFilter,
          magFilter: THREE.NearestFilter,
          format: THREE.RGBAFormat,
          type: THREE.FloatType,
          //type: THREE.UnsignedByteType,
          //depthBuffer: false,
          //stencilBuffer: false
        });

        //depthTexture = new THREE.Texture();
        //depthTexture.__webglInit = true;
        //depthTexture.__webglTexture = gl.createTexture();;
        //gl.bindTexture(gl.TEXTURE_2D, depthTexture.__webglTexture);
        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        //gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT, 1024, 1024, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_SHORT, null);
      };

      var resize = function() {
        var width = me.elRenderArea.clientWidth;
        var height = me.elRenderArea.clientHeight;
        var aspect = width / height;

        var needsResize = (rtColor.width !== width || rtColor.height !== height);

        // disposal will be unnecessary once this fix made it into three.js master:
        // https://github.com/mrdoob/three.js/pull/6355
        if (needsResize) {
          rtColor.dispose();
        }

        camera.aspect = aspect;
        camera.updateProjectionMatrix();

        me.renderer.setSize(width, height);
        rtColor.setSize(width, height);

        //if(needsResize){
        //	renderer.setRenderTarget(rtColor);
        //	var framebuffer = rtColor.__webglFramebuffer;
        //	gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        //
        //
        //	gl.bindRenderbuffer( gl.RENDERBUFFER, rtColor.__webglRenderbuffer );
        //	gl.renderbufferStorage( gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, rtColor.width, rtColor.height );
        //	gl.framebufferRenderbuffer( gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, null );
        //
        //	gl.bindTexture(gl.TEXTURE_2D, depthTexture.__webglTexture);
        //	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        //	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        //	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        //	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        //	gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT, width, height, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT, null);
        //
        //	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, depthTexture.__webglTexture, 0);
        //
        //	renderer.setRenderTarget(null);
        //}
      };

      this.render = function() {
        initEDL();

        resize();

        me.renderer.clear();
        if (me.settings.showSkybox) {
          skybox.camera.rotation.copy(camera.rotation);
          me.renderer.render(skybox.scene, skybox.camera);
        // } else {
        //   me.renderer.render(sceneBG, cameraBG);
        }
        me.renderer.render(scene, camera);

        if (pointcloud) {
          var width = me.elRenderArea.clientWidth;
          var height = me.elRenderArea.clientHeight;

          var octreeSize = pointcloud.pcoGeometry.boundingBox.size().x;

          pointcloud.visiblePointsTarget = me.settings.pointCountTarget * 1000 * 1000;
          // var originalMaterial = pointcloud.material;

          { // COLOR & DEPTH PASS
            attributeMaterial.size = me.settings.pointSize;
            attributeMaterial.pointSizeType = me.settings.pointSizeType;
            attributeMaterial.screenWidth = width;
            attributeMaterial.screenHeight = height;
            attributeMaterial.pointColorType = me.settings.pointColorType;
            attributeMaterial.uniforms.visibleNodes.value = pointcloud.material.visibleNodesTexture;
            attributeMaterial.uniforms.octreeSize.value = octreeSize;
            attributeMaterial.fov = camera.fov * (Math.PI / 180);
            attributeMaterial.spacing = pointcloud.pcoGeometry.spacing;
            attributeMaterial.near = camera.near;
            attributeMaterial.far = camera.far;
            attributeMaterial.heightMin = me.settings.heightMin;
            attributeMaterial.heightMax = me.settings.heightMax;
            attributeMaterial.intensityMin = pointcloud.material.intensityMin;
            attributeMaterial.intensityMax = pointcloud.material.intensityMax;
            attributeMaterial.setClipBoxes(pointcloud.material.clipBoxes);
            attributeMaterial.clipMode = pointcloud.material.clipMode;
            attributeMaterial.bbSize = pointcloud.material.bbSize;
            attributeMaterial.treeType = pointcloud.material.treeType;

            scene.overrideMaterial = attributeMaterial;
            me.renderer.clearTarget(rtColor, true, true, true);
            me.renderer.render(scene, camera, rtColor);
            scene.overrideMaterial = null;
          }

          { // EDL OCCLUSION PASS
            edlMaterial.uniforms.screenWidth.value = width;
            edlMaterial.uniforms.screenHeight.value = height;
            edlMaterial.uniforms.near.value = camera.near;
            edlMaterial.uniforms.far.value = camera.far;
            edlMaterial.uniforms.colorMap.value = rtColor;
            edlMaterial.uniforms.expScale.value = camera.far;

            //edlMaterial.uniforms.depthMap.value = depthTexture;

            Potree.utils.screenPass.render(me.renderer, edlMaterial);
          }

          me.renderer.render(scene, camera);

          MeasuringService.tools.heightprofile.render();
          MeasuringService.tools.volume.render();
          me.renderer.clearDepth();
          MeasuringService.tools.measuring.render();
          MeasuringService.tools.transformation.render();
        }


      };
    };

    this.loop = function() {
      requestAnimationFrame(me.loop);

      me.update();

			// if(me.settings.highQuality) {
      //   me.renderHighQuality();
			// }else{
			// 	me.render();
			// }

      if (me.settings.useEDL) {
        if (!edlRenderer) {
          edlRenderer = new EDLRenderer();
        }
        edlRenderer.render(me.renderer);
      } else if (me.settings.quality === 'Splats') {
        if (!highQualityRenderer) {
          highQualityRenderer = new HighQualityRenderer();
        }
        highQualityRenderer.render(me.renderer);
      } else {
        potreeRenderer.render();
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
