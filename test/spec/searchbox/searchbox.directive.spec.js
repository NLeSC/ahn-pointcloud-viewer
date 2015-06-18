'use strict';

describe('searchbox.directive', function() {

  // load the module
  beforeEach(module('pattyApp.searchbox'));

  var $compile;
  var $rootScope;
  beforeEach(function() {
    inject(function(_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
    });
  });

  describe('initial state', function() {
    var result;
    beforeEach(function() {
      var scope = $rootScope.$new();
      var template = angular.element('<patty-search-panel class="clickable"></patty-search-panel>');
      result = $compile(template)(scope);
      scope.$digest();
    });

    it('should have a search field', function() {
      expect(result.html()).toContain('input type="search"');
    });

    it('should have a search button', function() {
      expect(result.html()).toContain('glyphicon-search');
    });

    it('should have a home button', function() {
      expect(result.html()).toContain('glyphicon-home');
    });
  });
});
