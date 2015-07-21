'use strict';

describe('earthcontrols.controller', function() {
  // load the module
  beforeEach(module('pattyApp.earthcontrols'));

  var msgbus, scope, ctrl;

  beforeEach(inject(function($rootScope, $controller, Messagebus) {
    msgbus = Messagebus;
    scope = $rootScope.$new();
    ctrl = $controller('EarthcontrolsController', { $scope: scope });
  }));

  it('should not initially be turned on', function() {
    expect(ctrl.enabled).toBeFalsy();
  });

  describe('toggleEarthcontrols() function', function() {
    it('should turn on and broadcast over messagebus when toggled while off', function() {
      ctrl.enabled = false;
      spyOn(msgbus, 'publish');
      ctrl.toggleEarthcontrols();
      expect(ctrl.enabled).toBeTruthy();
      expect(msgbus.publish).toHaveBeenCalled();
    });

    it('should turn off and broadcast over messagebus when toggled while on', function() {
      ctrl.enabled = true;
      spyOn(msgbus, 'publish');
      ctrl.toggleEarthcontrols();
      expect(ctrl.enabled).toBeFalsy();
      expect(msgbus.publish).toHaveBeenCalled();
    });
  });
});
