'use strict';

describe('app', function() {
  beforeEach(module('pattyApp'));

  beforeEach(module('mockedDrivemap'));

  var $httpBackend, $rootScope;
  beforeEach(inject(function(_$httpBackend_, defaultDrivemapJSON, _$rootScope_) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('data/drivemap.json').respond(200, defaultDrivemapJSON);
    $httpBackend.flush();
    $rootScope = _$rootScope_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('pattyApp.run() function', function() {
    it('should call DrivemapService.load() function', inject(function(DrivemapService) {
      var callback = jasmine.createSpy('callback');
      DrivemapService.ready.then(callback);
      // trigger digest so promise then's are called
      $rootScope.$digest();
      expect(callback).toHaveBeenCalled();
    }));
  });
});
