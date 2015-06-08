'use strict';

describe('pointcloud-stats.directive', function() {

  // load the module
  beforeEach(module('pattyApp.pointcloud'));

  var $compile;
  var $rootScope;
  var PointcloudService;
  beforeEach(function() {
    inject(function(_$compile_, _$rootScope_, _PointcloudService_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      PointcloudService = _PointcloudService_;
    });
  });

  it('should have number of visible nodes', function() {
    var scope = $rootScope.$new();
    PointcloudService.stats.nrNodes = 123;
    var html = '<patty-pointcloud-stats></patty-pointcloud-stats>';
    var result = $compile(html)(scope);
    scope.$digest();
    expect(result.html()).toContain('Visible nodes: 123');
  });
});
