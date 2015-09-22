(function() {
  'use strict';

  function RendererService(THREE) {
    var me = this;
    var init = function (renderer, elRenderArea, camera) {
      me.renderer = renderer;
      me.elRenderArea = elRenderArea;
      me.camera = camera;
    };

    var PotreeRenderer = function() {
      this.render = function() {
        { // resize
          var width = me.elRenderArea.clientWidth;
          var height = me.elRenderArea.clientHeight;
          var aspect = width / height;

          me.camera.aspect = aspect;
          me.camera.updateProjectionMatrix();

          me.renderer.setSize(width, height);
        }


        // render skybox
        if (showSkybox) {
          skybox.camera.rotation.copy(me.camera.rotation);
          me.renderer.render(skybox.scene, skybox.camera);
        } else {
          me.renderer.render(sceneBG, cameraBG);
        }

        if (pointcloud) {
          if (pointcloud.originalMaterial) {
            pointcloud.material = pointcloud.originalMaterial;
          }

          var bbWorld = Potree.utils.computeTransformedBoundingBox(pointcloud.boundingBox, pointcloud.matrixWorld);

          pointcloud.visiblePointsTarget = pointCountTarget * 1000 * 1000;
          pointcloud.material.size = pointSize;
          pointcloud.material.opacity = opacity;
          pointcloud.material.pointColorType = pointColorType;
          pointcloud.material.pointSizeType = pointSizeType;
          pointcloud.material.pointShape = (quality === "Circles") ? Potree.PointShape.CIRCLE : Potree.PointShape.SQUARE;
          pointcloud.material.interpolate = (quality === "Interpolation");
          pointcloud.material.weighted = false;
        }

        // render scene
        renderer.render(scene, camera);
        renderer.render(scenePointCloud, camera);

        profileTool.render();
        volumeTool.render();

        renderer.clearDepth();
        measuringTool.render();
        transformationTool.render();
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
        if (depthMaterial != null) {
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
            type: "t",
            value: rtDepth
          },
          texture: {
            type: "t",
            value: rtNormalize
          }
        };

        normalizationMaterial = new THREE.ShaderMaterial({
          uniforms: uniformsNormalize,
          vertexShader: Potree.Shaders["normalize.vs"],
          fragmentShader: Potree.Shaders["normalize.fs"]
        });
      }

      var resize = function(width, height) {
        if (rtDepth.width == width && rtDepth.height == height) {
          return;
        }

        rtDepth.dispose();
        rtNormalize.dispose();

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
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
        if (showSkybox) {
          skybox.camera.rotation.copy(camera.rotation);
          renderer.render(skybox.scene, skybox.camera);
        } else {
          renderer.render(sceneBG, cameraBG);
        }
        renderer.render(scene, camera);

        if (pointcloud) {

          depthMaterial.uniforms.octreeSize.value = pointcloud.pcoGeometry.boundingBox.size().x;
          attributeMaterial.uniforms.octreeSize.value = pointcloud.pcoGeometry.boundingBox.size().x;

          pointcloud.visiblePointsTarget = pointCountTarget * 1000 * 1000;
          var originalMaterial = pointcloud.material;

          { // DEPTH PASS
            depthMaterial.size = pointSize;
            depthMaterial.pointSizeType = pointSizeType;
            depthMaterial.screenWidth = width;
            depthMaterial.screenHeight = height;
            depthMaterial.uniforms.visibleNodes.value = pointcloud.material.visibleNodesTexture;
            depthMaterial.uniforms.octreeSize.value = pointcloud.pcoGeometry.boundingBox.size().x;
            depthMaterial.fov = camera.fov * (Math.PI / 180);
            depthMaterial.spacing = pointcloud.pcoGeometry.spacing;
            depthMaterial.near = camera.near;
            depthMaterial.far = camera.far;
            depthMaterial.heightMin = heightMin;
            depthMaterial.heightMax = heightMax;
            depthMaterial.uniforms.visibleNodes.value = pointcloud.material.visibleNodesTexture;
            depthMaterial.uniforms.octreeSize.value = pointcloud.pcoGeometry.boundingBox.size().x;
            depthMaterial.bbSize = pointcloud.material.bbSize;
            depthMaterial.treeType = pointcloud.material.treeType;

            scenePointCloud.overrideMaterial = depthMaterial;
            renderer.clearTarget(rtDepth, true, true, true);
            renderer.render(scenePointCloud, camera, rtDepth);
            scenePointCloud.overrideMaterial = null;
          }

          { // ATTRIBUTE PASS
            attributeMaterial.size = pointSize;
            attributeMaterial.pointSizeType = pointSizeType;
            attributeMaterial.screenWidth = width;
            attributeMaterial.screenHeight = height;
            attributeMaterial.pointColorType = pointColorType;
            attributeMaterial.depthMap = rtDepth;
            attributeMaterial.uniforms.visibleNodes.value = pointcloud.material.visibleNodesTexture;
            attributeMaterial.uniforms.octreeSize.value = pointcloud.pcoGeometry.boundingBox.size().x;
            attributeMaterial.fov = camera.fov * (Math.PI / 180);
            attributeMaterial.spacing = pointcloud.pcoGeometry.spacing;
            attributeMaterial.near = camera.near;
            attributeMaterial.far = camera.far;
            attributeMaterial.heightMin = heightMin;
            attributeMaterial.heightMax = heightMax;
            attributeMaterial.intensityMin = pointcloud.material.intensityMin;
            attributeMaterial.intensityMax = pointcloud.material.intensityMax;
            attributeMaterial.setClipBoxes(pointcloud.material.clipBoxes);
            attributeMaterial.clipMode = pointcloud.material.clipMode;
            attributeMaterial.bbSize = pointcloud.material.bbSize;
            attributeMaterial.treeType = pointcloud.material.treeType;

            scenePointCloud.overrideMaterial = attributeMaterial;
            renderer.clearTarget(rtNormalize, true, true, true);
            renderer.render(scenePointCloud, camera, rtNormalize);
            scenePointCloud.overrideMaterial = null;
          }

          { // NORMALIZATION PASS
            normalizationMaterial.uniforms.depthMap.value = rtDepth;
            normalizationMaterial.uniforms.texture.value = rtNormalize;
            Potree.utils.screenPass.render(renderer, normalizationMaterial);
          }

          pointcloud.material = originalMaterial;

          volumeTool.render();
          renderer.clearDepth();
          profileTool.render();
          measuringTool.render();
          transformationTool.render();
        }


      }
    };



    var edlRenderer = null;
    var EDLRenderer = function() {

      var edlMaterial = null;
      var attributeMaterial = null;

      //var depthTexture = null;

      var rtColor = null;
      var gl = renderer.context;

      var initEDL = function() {
        if (edlMaterial != null) {
          return;
        }

        //var depthTextureExt = gl.getExtension("WEBGL_depth_texture");

        edlMaterial = new Potree.EyeDomeLightingMaterial();
        attributeMaterial = new Potree.PointCloudMaterial();

        attributeMaterial.pointShape = Potree.PointShape.CIRCLE;
        attributeMaterial.interpolate = false;
        attributeMaterial.weighted = false;
        attributeMaterial.minSize = 2;
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

        var needsResize = (rtColor.width != width || rtColor.height != height);

        // disposal will be unnecessary once this fix made it into three.js master:
        // https://github.com/mrdoob/three.js/pull/6355
        if (needsResize) {
          rtColor.dispose();
        }

        camera.aspect = aspect;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
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
      }

      this.render = function() {

        initEDL();

        resize();

        renderer.clear();
        if (showSkybox) {
          skybox.camera.rotation.copy(camera.rotation);
          renderer.render(skybox.scene, skybox.camera);
        } else {
          renderer.render(sceneBG, cameraBG);
        }
        renderer.render(scene, camera);

        if (pointcloud) {
          var width = me.elRenderArea.clientWidth;
          var height = me.elRenderArea.clientHeight;

          var octreeSize = pointcloud.pcoGeometry.boundingBox.size().x;

          pointcloud.visiblePointsTarget = pointCountTarget * 1000 * 1000;
          var originalMaterial = pointcloud.material;

          { // COLOR & DEPTH PASS
            attributeMaterial.size = pointSize;
            attributeMaterial.pointSizeType = pointSizeType;
            attributeMaterial.screenWidth = width;
            attributeMaterial.screenHeight = height;
            attributeMaterial.pointColorType = pointColorType;
            attributeMaterial.uniforms.visibleNodes.value = pointcloud.material.visibleNodesTexture;
            attributeMaterial.uniforms.octreeSize.value = octreeSize;
            attributeMaterial.fov = camera.fov * (Math.PI / 180);
            attributeMaterial.spacing = pointcloud.pcoGeometry.spacing;
            attributeMaterial.near = camera.near;
            attributeMaterial.far = camera.far;
            attributeMaterial.heightMin = heightMin;
            attributeMaterial.heightMax = heightMax;
            attributeMaterial.intensityMin = pointcloud.material.intensityMin;
            attributeMaterial.intensityMax = pointcloud.material.intensityMax;
            attributeMaterial.setClipBoxes(pointcloud.material.clipBoxes);
            attributeMaterial.clipMode = pointcloud.material.clipMode;
            attributeMaterial.bbSize = pointcloud.material.bbSize;
            attributeMaterial.treeType = pointcloud.material.treeType;

            scenePointCloud.overrideMaterial = attributeMaterial;
            renderer.clearTarget(rtColor, true, true, true);
            renderer.render(scenePointCloud, camera, rtColor);
            scenePointCloud.overrideMaterial = null;
          }

          { // EDL OCCLUSION PASS
            edlMaterial.uniforms.screenWidth.value = width;
            edlMaterial.uniforms.screenHeight.value = height;
            edlMaterial.uniforms.near.value = camera.near;
            edlMaterial.uniforms.far.value = camera.far;
            edlMaterial.uniforms.colorMap.value = rtColor;
            edlMaterial.uniforms.expScale.value = camera.far;

            //edlMaterial.uniforms.depthMap.value = depthTexture;

            Potree.utils.screenPass.render(renderer, edlMaterial);
          }

          renderer.render(scene, camera);

          profileTool.render();
          volumeTool.render();
          renderer.clearDepth();
          measuringTool.render();
          transformationTool.render();
        }


      }
    };

  }

  angular.module('pattyApp.pointcloud')
    .service('RendererService', RendererService);
})();
