'use strict';

describe('pointcloud.railService', function() {
  // load the module
  beforeEach(module('mockedRail', 'mockedDrivemap'));

  beforeEach(module('pattyApp.pointcloud'));

  var service;
  var THREE;
  beforeEach(function() {
    inject(function(RailService, CameraService, SceneService,
      demoWaypointsJSON,
      defaultDrivemapJSON, defaultDrivemapWaypointsJSON,
      DrivemapService,
      _THREE_) {
      this.CameraService = CameraService;
      this.SceneService = SceneService;
      this.demoWaypointsJSON = demoWaypointsJSON;
      DrivemapService.onLoad(defaultDrivemapJSON);
      this.DrivemapService = DrivemapService;
      this.defaultDrivemapWaypointsJSON = defaultDrivemapWaypointsJSON;
      service = RailService;
      THREE = _THREE_;
    });
  });

  describe('initial state', function() {
    it('should have zero waypoints', function() {
      expect(service.waypoints).toEqual([]);
    });

    it('should have a camera curve', function() {
      expect(service.cameraCurve).toEqual(new THREE.SplineCurve3());
    });

    it('should have a look at curve', function() {
      expect(service.lookatCurve).toEqual(new THREE.SplineCurve3());
    });

    it('should have a data url', function() {
      expect(service.dataUrl).toStartWith('blob:');
    });

    describe('the scene', function() {
      it('should have a name', function() {
        expect(service.scene.name).toEqual('rail');
      });

      it('should be invisible', function() {
        expect(service.scene.visible).toBeFalsy();
      });

      it('should have been registered with the SceneService', function() {
        var regScene = this.SceneService.getScene().getObjectByName('rail');
        expect(service.scene).toBe(regScene);
      });
    });
  });

  describe('filled with setWaypoints', function() {
    beforeEach(function() {
      service.setWaypoints(this.demoWaypointsJSON);
    });

    it('should have 3 waypoints', function() {
      expect(service.waypoints.length).toEqual(3);
    });

    it('should have a filled camera curve', function() {
      expect(service.cameraCurve.getLength()).toBeCloseTo(1007.7483, 3);
    });

    it('should have a filled look at curve', function() {
      expect(service.lookatCurve.getLength()).toBeCloseTo(1007.6338, 3);
    });

    describe('the scene', function() {
      beforeEach(function() {
        this.railScene = this.SceneService.getScene().getObjectByName('rail');
      });

      it('should have a camera tube', function() {
        expect(this.railScene.getObjectByName('camera')).toBeDefined();
      });

      it('should have a look at tube', function() {
        expect(this.railScene.getObjectByName('lookat')).toBeDefined();
      });
    });

    describe('firstCameraPosition() function', function() {
      it('should return camera position of first waypoint', function() {
        var pos = service.firstCameraPosition();
        expect(pos.x).toBeCloseTo(90274.0263, 3);
        expect(pos.y).toBeCloseTo(421299.0494, 3);
        expect(pos.z).toBeCloseTo(376.9782, 3);
      });
    });

    describe('firstLookatPosition() function', function() {
      it('should return look at position of first waypoint', function() {
        var pos = service.firstLookatPosition();
        expect(pos.x).toBeCloseTo(90270.4787, 3);
        expect(pos.y).toBeCloseTo(421291.3830, 3);
        expect(pos.z).toBeCloseTo(371.6266, 3);
      });
    });
  });

  describe('clear() function', function() {
    beforeEach(function() {
      service.setWaypoints(this.demoWaypointsJSON);
      service.clear();
    });

    it('should have zero waypoints', function() {
      expect(service.waypoints).toEqual([]);
    });
  });

  describe('removeLast() function', function() {
    beforeEach(function() {
      service.setWaypoints(this.demoWaypointsJSON);
      service.removeLast();
    });

    it('should have 2 waypoints', function() {
      expect(service.waypoints.length).toEqual(2);
    });

    it('should have a shorter camera curve', function() {
      expect(service.cameraCurve.getLength()).toBeCloseTo(386.2549, 3);
    });

    it('should have a shorter look at curve', function() {
      expect(service.lookatCurve.getLength()).toBeCloseTo(385.7594, 3);
    });
  });

  describe('setCameraAndLookAtWaypoints() function', function() {
    beforeEach(function() {
      service.setCameraAndLookAtWaypoints(
        this.DrivemapService.getCameraPath(),
        this.DrivemapService.getLookPath()
      );
    });

    it('should have merged camera and look at arrays into waypoints array', function() {
      expect(service.waypoints).toEqual(this.defaultDrivemapWaypointsJSON);
    });
  });

  describe('upload() function', function() {
    describe('upload zero files', function() {
      beforeEach(function() {
        service.upload([]);
      });

      it('should not fill waypoints', function() {
        expect(service.waypoints.length).toEqual(0);
      });
    });

    describe('upload single file', function() {
      beforeEach(function() {
        this.file = 'bla';
        service.filereader = jasmine.createSpyObj('filereader', ['readAsText']);
        service.upload([this.file]);
      });

      it('should call filereader.readAsText', function() {
        expect(service.filereader.readAsText).toHaveBeenCalledWith(this.file);
      });
    });
  });

  describe('onFileUpload() function', function() {
    beforeEach(inject(function(toastr) {
      this.toastr = toastr;
      spyOn(toastr, 'success');
      spyOn(toastr, 'error');
    }));

    describe('when upload success', function() {
      beforeEach(function() {
        service.filereader = jasmine.createSpyObj('filereader', ['readAsText']);
        service.filereader.readyState = FileReader.DONE;
        var body = JSON.stringify(this.demoWaypointsJSON);
        service.onFileUpload({
          target: {
            result: body
          }
        });
      });

      it('should save waypoints', function() {
        expect(service.waypoints).toEqual(this.demoWaypointsJSON);
      });

      it('should show toastr success message', function() {
        expect(this.toastr.success).toHaveBeenCalled();
      });
    });

    describe('when uploaded a empty file', function() {
      beforeEach(function() {
        service.filereader.readyState = FileReader.EMPTY;
        service.onFileUpload({
          target: null
        });
      });

      it('should show toastr error message', function() {
        expect(this.toastr.error).toHaveBeenCalled();
      });
    });
  });
});
