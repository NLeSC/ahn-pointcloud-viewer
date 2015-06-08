'use strict';

describe('pointcloud-canvas.directive', function() {

  // load the module
  beforeEach(module('pattyApp.pointcloud'));

  var PointcloudService;
  var $compile;
  var $rootScope;


  beforeEach(function() {
    inject(function(_$compile_, _$rootScope_, _PointcloudService_) {
      PointcloudService = _PointcloudService_;
      $compile = _$compile_;
      $rootScope = _$rootScope_;
    });
  });

  it('should attach canvas to element', function() {
    var scope = $rootScope.$new();
    spyOn(PointcloudService, 'attachCanvas');

    var html = angular.element('<patty-pointcloud-canvas></patty-pointcloud-canvas>');
    $compile(html)(scope);
    scope.$digest();

    expect(PointcloudService.attachCanvas).toHaveBeenCalledWith(html[0]);
  });
});
