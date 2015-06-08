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

  it('should have a search box', function() {
    var scope = $rootScope.$new();
    var html = '<patty-search-panel class="clickable"></patty-search-panel>';
    var result = $compile(html)(scope);
    scope.$digest();
    expect(result.html()).toContain('input type="text"');
  });
});
