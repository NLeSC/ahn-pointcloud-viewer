'use strict';

describe('searchbox.controller', function() {

  // load the module
  beforeEach(module('pattyApp.searchbox'));

  var ctrl;
  var PointcloudService;

  beforeEach(function() {
    inject(function(_$controller_, _PointcloudService_) {
      PointcloudService = _PointcloudService_;
      var $controller = _$controller_;
      ctrl = $controller('SearchPanelController');
    });
  });

  describe('initial state', function() {
    it('should have currentPage equal to 1', function() {
      expect(ctrl.currentPage).toEqual(1);
    });

    it('should have disabledButtons', function() {
      var db = {
      };
      expect(ctrl.disabledButtons).toEqual(db);
    });
  });

  describe('onQueryChange function', function() {
    it('should set currentPage equal to 1', function() {
      ctrl.currentPage = 234;
      ctrl.onQueryChange();
      expect(ctrl.currentPage).toEqual(1);
    });
  });
});
