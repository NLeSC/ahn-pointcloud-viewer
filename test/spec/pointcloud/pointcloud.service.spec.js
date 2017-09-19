'use strict';

describe('pointcloud.service', function() {

  // load the module
  beforeEach(module('pattyApp.pointcloud'));
  beforeEach(module('mockedDrivemap'));

  var PointcloudService;
  var Potree;
  beforeEach(function() {
    inject(function(_PointcloudService_, _Potree_) {
      PointcloudService = _PointcloudService_;
      Potree = _Potree_;
    });
  });

  describe('initial state', function() {
    it('should have settings', function() {

      var expected = {
        pointCountTarget: 5,
        pointSize: 1.0,
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
        qualities: { Splats: 'Splats', Low: 'Circle'  },
        quality: 'Circle',

        useDEMCollisions: false,
        minNodeSize: 100,
        heightMin: -5,
        heightMax: 45,
        useEDL: false
      };

      expect(PointcloudService.settings).toEqual(expected);
    });
  });

  describe('with DrivemapService loaded and OrbitControls and PathControls initialized', function() {
    var DrivemapService = null,
      canvasElement = null;

    beforeEach(inject(function(_DrivemapService_, defaultDrivemapJSON) {
      DrivemapService = _DrivemapService_;
      DrivemapService.onLoad(defaultDrivemapJSON);
    }));

    beforeEach(inject(function(PathControls, CameraService, defaultCameraPathThree, defaultLookPathThree, THREE) {
      canvasElement = jasmine.createSpyObj('element', ['addEventListener', 'removeEventListener']);
      PathControls.init(CameraService.camera, defaultCameraPathThree, defaultLookPathThree, canvasElement);
      PointcloudService.elRenderArea = canvasElement;
      PointcloudService.orbitControls = new THREE.OrbitControls(CameraService.camera, canvasElement);
    }));

    beforeEach(inject(function(POCLoader) {
      spyOn(POCLoader, 'load');
    }));

  });
});
