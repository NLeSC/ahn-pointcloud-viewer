'use strict';

describe('settings.directive', function() {

  // load the module
  beforeEach(module('pattyApp.settings'));

  var result;
  var scope;
  beforeEach(function() {
    inject(function($compile, $rootScope) {
      scope = $rootScope.$new();
      var template = angular.element('<patty-settings></patty-settings>');
      result = $compile(template)(scope);
      scope.$digest();
    });
  });

  describe('initial state', function() {
    it('should have a settings icon', function() {
      expect(result.html()).toContain('gear-icon');
    });

    it('should have a settings panel', function() {
      expect(result.html()).toContain('settings-panel');
    });
  });
});
