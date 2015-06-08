'use strict';

describe('cameramodes.directive', function() {

  // load the module
  beforeEach(module('pattyApp.cameramodes'));

  var result;
  var scope;
  beforeEach(function() {
    inject(function($compile, $rootScope) {
      scope = $rootScope.$new();
      var html = '<patty-camera-modes></patty-camera-modes>';
      result = $compile(html)(scope);
      scope.$digest();
    });
  });

  describe('initial state', function() {
    it('should have a onrails icon', function() {
      expect(result.html()).toContain('onrails-icon');
    });

    it('should have a fly icon', function() {
      expect(result.html()).toContain('fly-icon');
    });

    it('should have a demo icon', function() {
      expect(result.html()).toContain('demo-icon');
    });
  });
});
