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
    beforeEach(inject(function($httpBackend) {
      this.$httpBackend = $httpBackend;
    }));

    describe('when bing server returns error', function() {
      beforeEach(function() {
        ctrl.query = 'pernis';
        var expectedUrl = 'http://dev.virtualearth.net/REST/v1/Locations?incl=ciso2&jsonp=JSON_CALLBACK&q=pernis&key=Am6kAyf_AScih8y3ElNRSDpQ9xMJ8jn4yeePDKdHzhsNU4u7Jm-Ac8LJooYKmhbY&umv=3.37,50.75,7.21,53.47';
        this.$httpBackend.whenJSONP(expectedUrl).respond(401, '');
      });

      it('should produce an toastr error', function() {
        ctrl.search();

        this.$httpBackend.flush();
        expect(this.toastr.error).toHaveBeenCalled();
      });
    });

    describe('when bing server response has zero locations', function() {
      beforeEach(function() {
        ctrl.query = '1';
        var expectedUrl = 'http://dev.virtualearth.net/REST/v1/Locations?incl=ciso2&jsonp=JSON_CALLBACK&q=1&key=Am6kAyf_AScih8y3ElNRSDpQ9xMJ8jn4yeePDKdHzhsNU4u7Jm-Ac8LJooYKmhbY&umv=3.37,50.75,7.21,53.47';
        var response = {'authenticationResultCode':'ValidCredentials','brandLogoUri':'http:\/\/dev.virtualearth.net\/Branding\/logo_powered_by.png','copyright':'Copyright © 2015 Microsoft and its suppliers. All rights reserved. This API cannot be accessed and the content and any results may not be used, reproduced or transmitted in any manner without express written permission from Microsoft Corporation.','resourceSets':[{'estimatedTotal':0,'resources':[]}],'statusCode':200,'statusDescription':'OK','traceId':'0ad737c7769c448cb95e65ef02893562|BN20130721|02.00.163.2700|BN2SCH020180832'};
        this.$httpBackend.whenJSONP(expectedUrl).respond(response);
      });

      it('should produce an toastr warning', function() {
        ctrl.search();

        this.$httpBackend.flush();
        expect(this.toastr.warning).toHaveBeenCalled();
      });
    });

    describe('when query was found outside Netherlands', function() {
      beforeEach(function() {
        ctrl.query = 'paris';
        var expectedUrl = 'http://dev.virtualearth.net/REST/v1/Locations?incl=ciso2&jsonp=JSON_CALLBACK&q=paris&key=Am6kAyf_AScih8y3ElNRSDpQ9xMJ8jn4yeePDKdHzhsNU4u7Jm-Ac8LJooYKmhbY&umv=3.37,50.75,7.21,53.47';
        var response = {'authenticationResultCode':'ValidCredentials','brandLogoUri':'http:\/\/dev.virtualearth.net\/Branding\/logo_powered_by.png','copyright':'Copyright © 2015 Microsoft and its suppliers. All rights reserved. This API cannot be accessed and the content and any results may not be used, reproduced or transmitted in any manner without express written permission from Microsoft Corporation.','resourceSets':[{'estimatedTotal':5,'resources':[{'__type':'Location:http:\/\/schemas.microsoft.com\/search\/local\/ws\/rest\/v1','bbox':[48.515678405761719,1.4912785291671753,49.208442687988281,3.1950798034667969],'name':'Paris, Paris, France','point':{'type':'Point','coordinates':[48.856929779052734,2.3412001132965088]},'address':{'adminDistrict':'IdF','adminDistrict2':'Paris','countryRegion':'France','formattedAddress':'Paris, Paris, France','locality':'Paris','countryRegionIso2':'FR'},'confidence':'High','entityType':'PopulatedPlace','geocodePoints':[{'type':'Point','coordinates':[48.856929779052734,2.3412001132965088],'calculationMethod':'Rooftop','usageTypes':['Display']}],'matchCodes':['Good']},{'__type':'Location:http:\/\/schemas.microsoft.com\/search\/local\/ws\/rest\/v1','bbox':[33.612632751464844,-95.661384582519531,33.716548919677734,-95.4593734741211],'name':'Paris, TX','point':{'type':'Point','coordinates':[33.661281585693359,-95.563560485839844]},'address':{'adminDistrict':'TX','adminDistrict2':'Lamar Co.','countryRegion':'United States','formattedAddress':'Paris, TX','locality':'Paris','countryRegionIso2':'US'},'confidence':'High','entityType':'PopulatedPlace','geocodePoints':[{'type':'Point','coordinates':[33.661281585693359,-95.563560485839844],'calculationMethod':'Rooftop','usageTypes':['Display']}],'matchCodes':['Good']},{'__type':'Location:http:\/\/schemas.microsoft.com\/search\/local\/ws\/rest\/v1','bbox':[43.179569244384766,-80.395912170410156,43.206684112548828,-80.369071960449219],'name':'Paris, ON','point':{'type':'Point','coordinates':[43.190670013427734,-80.381668090820313]},'address':{'adminDistrict':'ON','adminDistrict2':'Brant','countryRegion':'Canada','formattedAddress':'Paris, ON','locality':'Paris','countryRegionIso2':'CA'},'confidence':'High','entityType':'PopulatedPlace','geocodePoints':[{'type':'Point','coordinates':[43.190670013427734,-80.381668090820313],'calculationMethod':'Rooftop','usageTypes':['Display']}],'matchCodes':['Good']},{'__type':'Location:http:\/\/schemas.microsoft.com\/search\/local\/ws\/rest\/v1','bbox':[36.283130645751953,-88.354461669921875,36.324832916259766,-88.293327331542969],'name':'Paris, TN','point':{'type':'Point','coordinates':[36.3018798828125,-88.325881958007813]},'address':{'adminDistrict':'TN','adminDistrict2':'Henry Co.','countryRegion':'United States','formattedAddress':'Paris, TN','locality':'Paris','countryRegionIso2':'US'},'confidence':'High','entityType':'PopulatedPlace','geocodePoints':[{'type':'Point','coordinates':[36.3018798828125,-88.325881958007813],'calculationMethod':'Rooftop','usageTypes':['Display']}],'matchCodes':['Good']},{'__type':'Location:http:\/\/schemas.microsoft.com\/search\/local\/ws\/rest\/v1','bbox':[39.592033386230469,-87.715690612792969,39.631813049316406,-87.6775131225586],'name':'Paris, IL','point':{'type':'Point','coordinates':[39.614688873291016,-87.695037841796875]},'address':{'adminDistrict':'IL','adminDistrict2':'Edgar Co.','countryRegion':'United States','formattedAddress':'Paris, IL','locality':'Paris','countryRegionIso2':'US'},'confidence':'High','entityType':'PopulatedPlace','geocodePoints':[{'type':'Point','coordinates':[39.614688873291016,-87.695037841796875],'calculationMethod':'Rooftop','usageTypes':['Display']}],'matchCodes':['Good']}]}],'statusCode':200,'statusDescription':'OK','traceId':'88bcc2b63cef474a8be3b8a23ad3e870|DB40190541|02.00.163.2700|BN2SCH020131418, BN2SCH020201626, BN2SCH020200817'};
        this.$httpBackend.whenJSONP(expectedUrl).respond(response);
      });

      it('should produce an toastr warning', function() {
        ctrl.search();

        this.$httpBackend.flush();
        expect(this.toastr.warning).toHaveBeenCalled();
      });
    });

    describe('when bing server response has at least one location', function() {
      beforeEach(function() {
        ctrl.query = 'pernis';
        var expectedUrl = 'http://dev.virtualearth.net/REST/v1/Locations?incl=ciso2&jsonp=JSON_CALLBACK&q=pernis&key=Am6kAyf_AScih8y3ElNRSDpQ9xMJ8jn4yeePDKdHzhsNU4u7Jm-Ac8LJooYKmhbY&umv=3.37,50.75,7.21,53.47';
        var response = {'authenticationResultCode':'ValidCredentials','brandLogoUri':'http:\/\/dev.virtualearth.net\/Branding\/logo_powered_by.png','copyright':'Copyright © 2015 Microsoft and its suppliers. All rights reserved. This API cannot be accessed and the content and any results may not be used, reproduced or transmitted in any manner without express written permission from Microsoft Corporation.','resourceSets':[{'estimatedTotal':1,'resources':[{'__type':'Location:http:\/\/schemas.microsoft.com\/search\/local\/ws\/rest\/v1','bbox':[51.879447937011719,4.3761205673217773,51.89508056640625,4.3962612152099609],'name':'Pernis, Netherlands','point':{'type':'Point','coordinates':[51.889228820800781,4.3876199722290039]},'address':{'adminDistrict':'South Holland','adminDistrict2':'Rotterdam','countryRegion':'Netherlands','formattedAddress':'Pernis, Netherlands','locality':'Pernis','countryRegionIso2':'NL'},'confidence':'High','entityType':'PopulatedPlace','geocodePoints':[{'type':'Point','coordinates':[51.889228820800781,4.3876199722290039],'calculationMethod':'Rooftop','usageTypes':['Display']}],'matchCodes':['Good']}]}],'statusCode':200,'statusDescription':'OK','traceId':'96bd0244f21d437cb03ba9814cadc0af|DB40170257|02.00.163.2700|DB4SCH010061257, BN2SCH020201526'};
        this.$httpBackend.whenJSONP(expectedUrl).respond(response);
      });

      it('should goto location', function() {
        spyOn(ctrl, 'gotoLocation');

        ctrl.search();

        this.$httpBackend.flush();
        expect(ctrl.gotoLocation).toHaveBeenCalledWith(4.3876199722290039, 51.889228820800781);
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
      var expected = new THREE.Vector3(86166.29908053015, 434714.07917005575, 1000);
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
