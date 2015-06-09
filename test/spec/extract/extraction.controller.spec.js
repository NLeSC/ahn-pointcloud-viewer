'use strict';

describe('extract.ExtractionController', function() {
  // load the module
  beforeEach(module('pattyApp.core'));
  beforeEach(module('pattyApp.extract'));

  beforeEach(inject(function ($controller, $httpBackend) {
    this.toastr = jasmine.createSpyObj('toastr', ['success', 'error']);
    this.ctrl = $controller('ExtractionController', {toastr: this.toastr});
    this.$httpBackend = $httpBackend;
  }));

  it('should not show the form initially', function() {
    expect(this.ctrl.showForm).toBeFalsy();
  });

  it('should have an empty size', function() {
    expect(this.ctrl.size).toEqual({});
  });

  it('should have an empty email', function() {
    expect(this.ctrl.email).toEqual('');
  });

  describe('count() function', function() {

    it('should submit /size POST to server', function() {
      var expectedRequest = JSON.stringify({
        left: 93720.22,
        bottom: 436899.97,
        right: 94428.37,
        top: 438334.32
      });
      var expected = {
        'points': 42132530,
        'level': 8,
        'coverage': 100.0
      };
      var fakeResponse = JSON.stringify(expected);
      this.$httpBackend.expectPOST('http://localhost/ahn-pointcloud-viewer/api/size', expectedRequest).respond(200, fakeResponse);

      this.ctrl.count();

      this.$httpBackend.flush();
      expect(this.ctrl.size).toEqual(expected);
    });
  });

  describe('submit() function', function() {

    it('should submit /size POST to server', function() {
      this.ctrl.showForm = true;
      this.ctrl.email = 'someone@example.com';
      var expectedRequest = {
        left: 93720.22,
        bottom: 436899.97,
        right: 94428.37,
        top: 438334.32,
        email: 'someone@example.com',
        level: 13
      };
      var expected = {
        'points': 42132530,
        'level': 8,
        'coverage': 100.0
      };
      this.$httpBackend.expectPOST('http://localhost/ahn-pointcloud-viewer/api/laz', expectedRequest).respond(200, expected);

      this.ctrl.submit();

      this.$httpBackend.flush();
      expect(this.ctrl.size).toEqual(expected);
      expect(this.toastr.success).toHaveBeenCalled();
      expect(this.ctrl.showForm).toBeFalsy();
    });
  });

});
