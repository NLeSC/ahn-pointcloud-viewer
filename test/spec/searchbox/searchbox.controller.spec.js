'use strict';

describe('searchbox.controller', function() {

  // load the module
  beforeEach(module('pattyApp.searchbox'));

  var ctrl;

  beforeEach(function() {
    inject(function($controller) {
      this.toastr = jasmine.createSpyObj('toastr', ['success', 'error', 'warning']);
      ctrl = $controller('SearchPanelController', {toastr: this.toastr});
    });
  });

  describe('initial state', function() {
    it('should have empty query', function() {
      expect(ctrl.query).toEqual('');
    });
  });

  describe('clear() function', function() {
    beforeEach(function() {
      ctrl.query = 'somewhere';
    });

    it('should empty query property', function() {
      ctrl.clear();

      expect(ctrl.query).toEqual('');
    });
  });

  describe('search() function', function() {
    beforeEach(inject(function(BingGeoCoderService, $q, $rootScope) {
      this.def = $q.defer();
      spyOn(BingGeoCoderService, 'geocode').and.returnValue(this.def.promise);
      this.$rootScope = $rootScope;
    }));

    describe('when geocoder returns error', function() {
      it('should produce an toastr error', function() {
        this.def.reject('error');
        ctrl.query = 'pernis';

        ctrl.search();
        this.$rootScope.$apply();

        expect(this.toastr.error).toHaveBeenCalled();
      });
    });

    describe('when geocoder returns zero locations', function() {

      it('should produce an toastr warning', function() {
        this.def.resolve([]);
        ctrl.query = 'pernis';

        ctrl.search();
        this.$rootScope.$apply();

        expect(this.toastr.warning).toHaveBeenCalled();
      });
    });

    describe('when getCurrentPositioncoder returns locations', function() {
      beforeEach(function() {
        var locations = [{
          name: 'Pernis, Nederland',
          point: {
            coordinates: [51.889228820800781, 4.3876199722290039]
          }
        }];
        this.def.resolve(locations);
        ctrl.query = 'pernis';
        spyOn(ctrl, 'gotoLocation');
      });

      it('should goto location', function() {

        ctrl.search();
        this.$rootScope.$apply();

        expect(ctrl.gotoLocation).toHaveBeenCalledWith(4.3876199722290039, 51.889228820800781);
      });

      it('should update query with trimmed location name', function() {
        ctrl.search();
        this.$rootScope.$apply();

        expect(ctrl.query).toEqual('Pernis');
      });
    });
  });

  describe('onQueryKeyPress() function', function() {
    beforeEach(function() {
      spyOn(ctrl, 'search');
    });

    it('should not search when non-enter key is pressed', function() {
      var codeForP = 80;
      ctrl.onQueryKeyPress({keyCode: codeForP });

      expect(ctrl.search).not.toHaveBeenCalled();
    });

    it('should search when enter key is pressed', function() {
      var codeForEnter = 13;
      ctrl.onQueryKeyPress({keyCode: codeForEnter });

      expect(ctrl.search).toHaveBeenCalled();
    });
  });

  describe('gotoLocation() function', function() {
    var THREE;

    beforeEach(inject(function(PathControls, _THREE_) {
      this.PathControls = PathControls;
      spyOn(PathControls, 'lookat');
      spyOn(PathControls, 'moveTo');
      THREE = _THREE_;

      ctrl.gotoLocation(4.3876199722290039, 51.889228820800781);
    }));

    it('should have camera look at the location in gl space', function() {
      var expected = new THREE.Vector3(86166.29908053015, 433714.07917005575, 0);
      expect(this.PathControls.lookat).toHaveBeenCalledWith(expected);
    });

    it('should have moved the camera to a location up and to the north in gl space', function() {
      var expected = new THREE.Vector3(86166.29908053015, 432714.07917005575, 1000);
      expect(this.PathControls.moveTo).toHaveBeenCalledWith(expected);
    });
  });

  describe('gotoCurrentLocation() function', function() {
    var nativeGeolocation;

    beforeEach(inject(function($window) {
      var geolocation = {getCurrentPosition: function(cb) {
        cb.apply(ctrl, [{coords:{longitude: 4.3876199722290039, latitude: 51.889228820800781}}]);
      }};
      nativeGeolocation = 'geolocation' in $window.navigator;
      if (nativeGeolocation) {
        spyOn($window.navigator, 'geolocation').and.returnValue(geolocation);
      } else {
        $window.navigator.geolocation = geolocation;
      }
    }));

    afterEach(inject(function($window) {
      if (!nativeGeolocation) {
        delete($window.navigator.geolocation);
      }
    }));

    it('should goto current browser location', function() {
      spyOn(ctrl, 'gotoLocation');

      ctrl.gotoCurrentLocation();

      expect(ctrl.gotoLocation).toHaveBeenCalledWith( 4.387619972229004, 51.88922882080078);
    });
  });

});
