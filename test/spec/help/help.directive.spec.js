'use strict';

describe('help.directive', function() {

  // load the module
  beforeEach(module('pattyApp.help'));

  var result;
  var scope;
  beforeEach(function() {
    inject(function($compile, $rootScope) {
      scope = $rootScope.$new();
      var html = '<patty-help></patty-help>';
      result = $compile(html)(scope);
      scope.$digest();
    });
  });

  describe('initial state', function() {
    it('should have a help icon', function() {
      expect(result.html()).toContain('help-icon');
    });

    it('should have a help modal', function() {
      expect(result.html()).toContain('helpModal');
    });
  });
});
