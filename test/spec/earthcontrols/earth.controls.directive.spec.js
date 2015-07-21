'use strict';

describe('earthcontrols.directive', function() {
  // load the module
  beforeEach(module('pattyApp.earthcontrols'));

  var result;
  var scope;

  beforeEach(function() {
    inject(function($compile, $rootScope) {
      scope = $rootScope.$new();
      var html = '<earthcontrols-directive></earthcontrols-directive>';
      result = $compile(html)(scope);
      scope.$digest();
    });
  });

  describe('initial state', function() {
    it('should have an earthcontrols icon', function() {
      expect(result.html()).toContain('octicon-globe');
    });
  });
});
