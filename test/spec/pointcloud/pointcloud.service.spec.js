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
        pointCountTarget: 2.5,
        pointSize: 1.00,
        opacity: 0,
        showSkybox: true,
        interpolate: true,
        showStats: false,
        highQuality: false,
        showBoundingBox: false,
        pointSizeType: Potree.PointSizeType.ADAPTIVE,
        pointSizeTypes: Potree.PointSizeType,
        pointColorType: Potree.PointColorType.HEIGHT,
        pointColorTypes: Potree.PointColorType,
        pointShape: Potree.PointShape.CIRCLE,
        pointShapes: Potree.PointShape,
        clipMode: Potree.ClipMode.HIGHLIGHT_INSIDE,
        clipModes: Potree.ClipMode,
        qualities:  Object({ Splats: 'Splats' }),
        quality: 'Splats',
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
