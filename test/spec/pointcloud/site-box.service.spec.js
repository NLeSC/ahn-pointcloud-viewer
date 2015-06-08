'use strict';

describe('site-box.service', function() {
  // TODO: tests using the referenceFrame

  // load the module
  var mockWindow;
  beforeEach(module('pattyApp.pointcloud', function($provide) {
    mockWindow = {
      innerWidth: 1920,
      innerHeight: 1200,
      addEventListener: jasmine.createSpy('addEventListener')
    };
    $provide.value('$window', mockWindow);
  }));

  beforeEach(module('mockedSites'));

  var SiteBoxService;
  beforeEach(function() {
    inject(function(_SiteBoxService_) {
      SiteBoxService = _SiteBoxService_;
    });
  });

  describe('initial state', function() {
    it('should have initial variables', function() {
      var initialMouse = {
        x: 0,
        y: 0
      };
      expect(SiteBoxService.mouse).toEqual(initialMouse);

      expect(SiteBoxService.siteBoxList).toEqual([]);
    });
  });

  describe('SiteBoxService initialization', function() {
    it('should set the mouse coordinates', function() {
      var realMouse = {
        x: 0.1,
        y: -0.1
      };

      SiteBoxService.init(realMouse);

      expect(SiteBoxService.mouse).toEqual(realMouse);
    });
  });

  describe('with SitesService loaded', function() {
    var SitesService = null;
    var CameraService = null;
    var THREE = null;
    var site162 = null;
    var siteBox162 = null;
    var hoverColor = null;
    var unHoverColor = null;

    beforeEach(function() {
      inject(function(_SitesService_, _THREE_, _CameraService_, defaultSitesJSON) {
        SitesService = _SitesService_;
        SitesService.onLoad(defaultSitesJSON);
        THREE = _THREE_;
        CameraService = _CameraService_;
        site162 = defaultSitesJSON[0];
        siteBox162 = SiteBoxService.createSiteBox(site162);
        SiteBoxService.siteBoxList = [siteBox162];
        hoverColor = new THREE.Color(0x99FFFF);
        unHoverColor = siteBox162.defaultMaterial.color;
      });
    });

    it('should create a sitebox (createSiteBox function)', function() {
      var center = SitesService.centerOfSite(site162);
      var position = new THREE.Vector3(center[0], center[1], site162.footprint_altitude[0]); // jshint ignore:line
      //var size = SitesService.getBoundingBoxSize(site162);

      // position
      expect(siteBox162.position).toEqual(position);
      // size
      // TODO: Cannot be tested in this way anymore since the footprints are now in. - Maarten
      //expect(siteBox162.geometry.parameters.width).toEqual(size[0]);
      //expect(siteBox162.geometry.parameters.height).toEqual(size[1]);
      //expect(siteBox162.geometry.parameters.depth).toEqual(size[2]);
      // site
      expect(siteBox162.site).toEqual(site162);
    });

    it('onSitesChanged function', function() {
      SiteBoxService.onSitesChanged([site162]);

      expect(SiteBoxService.siteBoxList[0].site.id).toEqual(siteBox162.site.id);
    });

    it('hoverOver(siteBox)', function() {
      SiteBoxService.hoverOver(siteBox162);

      expect(siteBox162.material.color).toEqual(hoverColor);
    });

    it('hoverOver(null)', function() {
      expect(SiteBoxService.hoverOver(null)).toEqual();
    });

    it('hoverOut function', function() {
      expect(siteBox162.material.color).toEqual(unHoverColor);

      SiteBoxService.hoverOver(siteBox162);
      SiteBoxService.hoverOut(siteBox162);

      expect(siteBox162.material.color).toEqual(unHoverColor);
    });

    it('hoverOut(null)', function() {
      expect(SiteBoxService.hoverOut(null)).toEqual();
    });

    it('resetHovering()', function() {
      SiteBoxService.hoverOver(siteBox162);
      SiteBoxService.resetHovering();

      expect(siteBox162.material.color).toEqual(unHoverColor);
    });

    /*
    it('should call functions in doHovering()', function() {
    TODO: Fix this test, i do not know what the new mouse coordinates should be now that I changed the boundingbox to the footprint - Maarten
      var mouse = {
        x: -0.03288409703504047,
        y: 0.4328358208955224
      };
      var cameraPosition = new THREE.Vector3(745.9560389992655, 130.67543380673797, -1464.348219166323);

      CameraService.camera.position.copy(cameraPosition);

      spyOn(SiteBoxService, 'resetHovering');
      spyOn(SiteBoxService, 'hoverOver');

      SiteBoxService.doHovering(mouse.x, mouse.y);

      expect(SiteBoxService.resetHovering).toHaveBeenCalled();
      expect(SiteBoxService.hoverOver).toHaveBeenCalled();
      expect(SiteBoxService.hoverOver).toHaveBeenCalledWith(siteBox162);
    });
    */

    it('addTextLabel function', function() {
      var textLabelName = 'textLabel for SiteBox ' + siteBox162.site.id;
      SiteBoxService.addTextLabel(siteBox162);

      expect(siteBox162.textLabel.name).toEqual(textLabelName);
    });

    it('toggleTextLabel function', function() {
      SiteBoxService.addTextLabel(siteBox162);

      expect(siteBox162.textLabel.visible).toEqual(true);

      SiteBoxService.toggleTextLabel(siteBox162);

      expect(siteBox162.textLabel.visible).toEqual(false);

      SiteBoxService.toggleTextLabel(siteBox162);

      expect(siteBox162.textLabel.visible).toEqual(true);
    });

    /*
    it('should detect site 162 (detectNearestSiteBoxUnderMouse function)', function() {
    TODO: Fix this test, i do not know what the new mouse coordinates should be now that I changed the boundingbox to the footprint - Maarten
      var mouse = {
        x: 866,
        y: 723
      };
      var cameraPosition = new THREE.Vector3(745.9560389992655, 130.67543380673797, -1464.348219166323);

      CameraService.camera.position.copy(cameraPosition);

      var selected = SiteBoxService.detectNearestSiteBoxUnderMouse(mouse.x, mouse.y);

      expect(selected).toEqual(siteBox162);

    });
    */

    /*
        it('should select null (detectNearestSiteBoxUnderMouse function)', function() {
          // TODO: fix this test, selected is not null, though it should be
          var mouse = {x: 0.3466307277628031, y: 0.8971807628524047};
          var cameraPosition = new THREE.Vector3(284.42472005449457, 1930.0100119084634, -2049.556595142666); // very high
          //var cameraPosition = new THREE.Vector3(745.9560389992655, 130.67543380673797, -1464.348219166323);

          CameraService.camera.position.copy(cameraPosition);

          SiteBoxService.mouse = mouse;

          var selected = SiteBoxService.detectNearestSiteBoxUnderMouse(mouse.x, mouse.y);

          console.log(SiteBoxService.siteBoxList.length);

          expect(selected).toEqual(null);

        });
    */
    describe('eventListener for double click', function() {

      var canvas;

      beforeEach(function() {
        canvas = jasmine.createSpyObj('canvas', ['addEventListener']);
      });

      it('should call addEventListener', function() {
        var f = SiteBoxService.selectSite;
        SiteBoxService.listenTo(canvas);
        expect(canvas.addEventListener).toHaveBeenCalledWith('dblclick', f, false);
      });

      it('should return when event is undefined', function() {
        expect(SiteBoxService.selectSite(undefined)).toEqual();
      });

      it('should select site on double click', function() {
        var mouse = {
          x: -0.03288409703504047,
          y: 0.4328358208955224
        };

        spyOn(SiteBoxService, 'detectNearestSiteBoxUnderMouse');

        SiteBoxService.mouse = mouse;
        SiteBoxService.selectSite('event');

        expect(SiteBoxService.detectNearestSiteBoxUnderMouse).toHaveBeenCalledWith(mouse.x, mouse.y);
      });
    });

  });
});
