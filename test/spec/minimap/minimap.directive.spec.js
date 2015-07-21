'use strict';

describe('minimap.directive', function() {

  // load the module
  beforeEach(module('pattyApp.minimap', 'pattyApp.extract'));

  var $compile;
  var $rootScope;
  beforeEach(function() {
    inject(function(_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
    });
  });

  it('should create open layers map html', function() {
    var scope = $rootScope.$new();
    var html = '<patty-minimap class="clickable"></patty-minimap>';
    var result = $compile(html)(scope);
    expect(result.html()).toContain('ol-control');
  });
});
