'use strict';

describe('app', function() {
  beforeEach(module('pattyApp'));

  beforeEach(module('mockedDrivemap', 'mockedSites'));

  var $httpBackend, $rootScope;
  beforeEach(inject(function(_$httpBackend_, defaultDrivemapJSON, defaultSitesJSON, _$rootScope_) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('data/drivemap.json').respond(200, defaultDrivemapJSON);
    $httpBackend.expectGET('http://148.251.106.132:8090/POTREE/CONF.json').respond(200, defaultSitesJSON);
    $httpBackend.flush();
    $rootScope = _$rootScope_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('pattyApp.run() function', function() {
    it('should call SitesService.load() function', inject(function(SitesService) {
      var callback = jasmine.createSpy('callback');
      SitesService.ready.then(callback);
      // trigger digest so promise then's are called
      $rootScope.$digest();
      expect(callback).toHaveBeenCalled();
    }));

    it('should call DrivemapService.load() function', inject(function(DrivemapService) {
      var callback = jasmine.createSpy('callback');
      DrivemapService.ready.then(callback);
      // trigger digest so promise then's are called
      $rootScope.$digest();
      expect(callback).toHaveBeenCalled();
    }));
  });
});
