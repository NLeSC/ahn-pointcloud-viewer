'use strict';

describe('extract.extractionPanel', function() {

  // load the module
  beforeEach(module('toastr'));
  beforeEach(module('pattyApp.extract'));

  var result;
  var scope;

  beforeEach(function() {
    inject(function($compile, $rootScope) {
      scope = $rootScope.$new();
      var html = '<extraction-panel></extraction-panel>';
      result = $compile(html)(scope);
      scope.$digest();
    });
  });

  describe('initial state', function() {
    it('should have a extract icon', function() {
      expect(result.html()).toContain('extract-icon');
    });

    it('should have a extract panel', function() {
      expect(result.html()).toContain('extract-panel');
    });
  });
});
