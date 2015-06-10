'use strict';

describe('measuring', function() {

  // load the module
  beforeEach(module('pattyApp.measuring'));

  it('should create an application controller', inject(function($rootScope, $controller, MeasuringService) {
      var scope = $rootScope.$new();
      var ctrl = $controller('MeasuringController', { $scope: scope, MeasuringService:MeasuringService });
      expect(ctrl).toBeDefined();
  }));

  describe('when the controller is loaded', function() {
    var scope;
    var ctrl;
    beforeEach(function() {
      inject(function($rootScope, $controller, MeasuringService) {
        scope = $rootScope.$new();
        ctrl = $controller('MeasuringController', { $scope: scope, MeasuringService: MeasuringService });
      });
    });

    describe('initial state', function() {
      it('should set default variables', function() {
        expect(ctrl.showToolboxTray).toBeFalsy();
        expect(ctrl.measuringService).toBeDefined();

        var tools = {
          measuring: null,
          volume: null,
          heightprofile: null,
          clipvolume: null,
          transformation: null
        };
        expect(ctrl.measuringService.tools).toEqual(tools);

        expect(ctrl.measuringService.pointcloud).toEqual(null);
        expect(ctrl.measuringService.profileWidth).toEqual(0.1);
        expect(ctrl.measuringService.initialized).toBeFalsy();

        expect(ctrl.measuringService.activeTransformationTool).toBe(ctrl.measuringService.transformationTools.ROTATE);
      });
    });
  });
});
