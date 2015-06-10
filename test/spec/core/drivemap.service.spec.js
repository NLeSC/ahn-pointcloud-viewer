'use strict';

describe('core.DrivemapService', function() {
  var service;
  var defaultDrivemapJSON;
  var $rootScope;
  var proj4;

  // load the module
  beforeEach(module('pattyApp.core', 'mockedDrivemap'));

  beforeEach(function() {
    inject(function(DrivemapService, _defaultDrivemapJSON_, _$rootScope_, _proj4_) {
      defaultDrivemapJSON = _defaultDrivemapJSON_;
      service = DrivemapService;
      proj4 = _proj4_;
      $rootScope = _$rootScope_;
    });
  });

  describe('initial state', function() {
    it('should have empty data object', function() {
      expect(service.data).toEqual({});
    });

    it('should have unresolved the ready promise', function() {
      var callback = jasmine.createSpy('callback');
      service.ready.then(callback);
      $rootScope.$digest();

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('load() function with success', function() {
    var $httpBackend;
    beforeEach(inject(function(_$httpBackend_) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('data/drivemap.json').respond(200, defaultDrivemapJSON);

      service.load();

      $httpBackend.flush();
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should have resolved the ready promise', function() {
      var callback = jasmine.createSpy('callback');
      service.ready.then(callback);
      $rootScope.$digest();

      expect(callback).toHaveBeenCalled();
    });

    it('should have projection defined', function() {
      // TODO should also compare proj4 definition string,
      // but havent found way to created an expected value
      expect(proj4.defs('urn:ogc:def:crs:EPSG::28992')).toBeDefined();
    });
  });

  describe('load() function with failure', function() {
    var $httpBackend;
    beforeEach(inject(function(_$httpBackend_) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('data/drivemap.json').respond(404, '');

      service.load();

      $httpBackend.flush();
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should have resolved the ready promise with error', function() {
      var errorCallback = jasmine.createSpy('callback');
      service.ready.catch(errorCallback);
      $rootScope.$digest();

      expect(errorCallback).toHaveBeenCalled();
    });

    it('should have written to log', inject(function($log) {
      expect($log.log.logs).toEqual([['Failed to load drive map!!']]);
    }));
  });

  describe('after data has been loaded', function() {
    beforeEach(function() {
      service.onLoad(defaultDrivemapJSON);
    });

    describe('getPointcloudUrl() function', function() {
      it('should return an url', function() {
        expect(service.getPointcloudUrl()).toEqual('http://131.180.126.49/tiled_ahn2_dirty_2tiles_potree/tile_4_5/cloud.js');
      });
    });

    describe('getCameraPath() function', function() {
      it('should return coordinates of first feature', inject(function(defaultCameraPathGeo) {
        expect(service.getCameraPath()).toEqual(defaultCameraPathGeo);
      }));
    });

    describe('getLookPath() function', function() {
      it('should return coordinates of first feature', inject(function(defaultLookPathGeo) {
        expect(service.getLookPath()).toEqual(defaultLookPathGeo);
      }));
    });
  });
});
