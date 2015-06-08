'use strict';

describe('pointcloud.service', function() {

  // load the module
  beforeEach(module('pattyApp.pointcloud'));
  beforeEach(module('mockedSites', 'mockedDrivemap'));

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
        pointCountTarget: 2.0,
        pointSize: 0.15,
        opacity: 1,
        showSkybox: true,
        interpolate: true,
        showStats: false,
        pointSizeType: Potree.PointSizeType.ATTENUATED,
        pointSizeTypes: Potree.PointSizeType,
        pointColorType: Potree.PointColorType.RGB,
        pointColorTypes: Potree.PointColorType,
        pointShapes: Potree.PointShape,
        pointShape: Potree.PointShape.CIRCLE,
        clipMode: Potree.ClipMode.HIGHLIGHT_INSIDE,
        clipModes: Potree.ClipMode
      };

      expect(PointcloudService.settings).toEqual(expected);
    });
  });

  describe('with SitesService, DrivemapService loaded and OrbitControls and PathControls initialized', function() {
    var SitesService = null,
      DrivemapService = null,
      canvasElement = null,
      site162 = null;

    beforeEach(inject(function(_SitesService_, defaultSitesJSON) {
      SitesService = _SitesService_;
      SitesService.onLoad(defaultSitesJSON);
      site162 = defaultSitesJSON[0];
    }));

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

    describe('enterOrbitMode() function', function() {
      beforeEach(function() {
        PointcloudService.enterOrbitMode(null, site162);
      });

      it('should select the site', function() {
        expect(SitesService.searched).toEqual([site162]);
      });

      it('should set isInOrbitMode to true', function() {
        expect(PointcloudService.isInOrbitMode).toBeTruthy();
      });
    });

    describe('exitOrbitMode() function', function() {
      beforeEach(function() {
        PointcloudService.exitOrbitMode();
      });

      it('should select no sites', function() {
        expect(SitesService.searched).toEqual([]);
      });

      it('should set isInOrbitMode to false', function() {
        expect(PointcloudService.isInOrbitMode).toBeFalsy();
      });
    });
  });
});
