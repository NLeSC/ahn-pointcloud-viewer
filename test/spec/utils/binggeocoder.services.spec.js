'use strict';

describe('utils.binggeocoder', function() {
  beforeEach(module('pattyApp.utils'));

  var service;
  beforeEach(inject(function(BingGeoCoderService) {
    service = BingGeoCoderService;
  }));

  beforeEach(inject(function($httpBackend, $rootScope) {
    this.$httpBackend = $httpBackend;
    this.$rootScope = $rootScope;
  }));

  describe('inital state', function() {
    it('should have an Bing Maps Key', function() {
      expect(service.bingMapsKey).toBeTruthy();
    });

    it('should have a culture', function() {
      expect(service.culture).toBe('nl');
    });

    it('should have a bounding box', function() {
      expect(service.boundingBox).toEqual({
        minlon: 3.37,
        minlat: 50.75,
        maxlon: 7.21,
        maxlat: 53.47
      });
    });
  });

  describe('geocode() function', function() {

    describe('when bing server response with error', function() {
      it('should call error callback of promise', function() {
        var url = 'http://dev.virtualearth.net/REST/v1/Locations?jsonp=JSON_CALLBACK&q=pernis&key=Am6kAyf_AScih8y3ElNRSDpQ9xMJ8jn4yeePDKdHzhsNU4u7Jm-Ac8LJooYKmhbY&c=nl';
        this.$httpBackend.whenJSONP(url).respond(401, '');

        var promise = service.geocode('pernis');

        var errorCallback = jasmine.createSpy('error');
        promise.catch(errorCallback);

        this.$httpBackend.flush();

        expect(errorCallback).toHaveBeenCalled();
      });
    });

    describe('when bing server response with zero locations', function() {
      it('should return empty array of resources', function() {
        var url = 'http://dev.virtualearth.net/REST/v1/Locations?jsonp=JSON_CALLBACK&q=gdrhugoeshjgos&key=Am6kAyf_AScih8y3ElNRSDpQ9xMJ8jn4yeePDKdHzhsNU4u7Jm-Ac8LJooYKmhbY&c=nl';
        var expectedResponse = {
          'authenticationResultCode': 'ValidCredentials',
          'brandLogoUri': 'http:\/\/dev.virtualearth.net\/Branding\/logo_powered_by.png',
          'copyright': 'Copyright © 2015 Microsoft and its suppliers. All rights reserved. This API cannot be accessed and the content and any results may not be used, reproduced or transmitted in any manner without express written permission from Microsoft Corporation.',
          'resourceSets': [{
            'estimatedTotal': 0,
            'resources': []
          }],
          'statusCode': 200,
          'statusDescription': 'OK',
          'traceId': '9abfe3666868473a8caeb259620ac993|BN20181720|02.00.163.2700|BN2SCH020131523, i-fca19f2c.us-east-1c'
        };
        this.$httpBackend.whenJSONP(url).respond(expectedResponse);

        var promise = service.geocode('gdrhugoeshjgos');

        var resources;
        promise.then(function(value) {
          resources = value;
        });

        this.$httpBackend.flush();

        expect(resources).toEqual([]);
      });
    });

    describe('when bing server response with location which are outside bounding box', function() {
      it('should return empty array of resources', function() {
        var url = 'http://dev.virtualearth.net/REST/v1/Locations?jsonp=JSON_CALLBACK&q=paris&key=Am6kAyf_AScih8y3ElNRSDpQ9xMJ8jn4yeePDKdHzhsNU4u7Jm-Ac8LJooYKmhbY&c=nl';
        var expectedResponse = {
          'authenticationResultCode': 'ValidCredentials',
          'brandLogoUri': 'http://dev.virtualearth.net/Branding/logo_powered_by.png',
          'copyright': 'Copyright © 2015 Microsoft and its suppliers. All rights reserved. This API cannot be accessed and the content and any results may not be used, reproduced or transmitted in any manner without express written permission from Microsoft Corporation.',
          'resourceSets': [{
            'estimatedTotal': 5,
            'resources': [{
              '__type': 'Location:http://schemas.microsoft.com/search/local/ws/rest/v1',
              'address': {
                'adminDistrict': 'IdF',
                'adminDistrict2': 'Parijs',
                'countryRegion': 'Frankrijk',
                'formattedAddress': 'Parijs, Parijs, Frankrijk',
                'locality': 'Parijs'
              },
              'bbox': [
                48.51567840576172,
                1.4912785291671753,
                49.20844268798828,
                3.195079803466797
              ],
              'confidence': 'High',
              'entityType': 'PopulatedPlace',
              'geocodePoints': [{
                'calculationMethod': 'Rooftop',
                'coordinates': [
                  48.856929779052734,
                  2.341200113296509
                ],
                'type': 'Point',
                'usageTypes': [
                  'Display'
                ]
              }],
              'matchCodes': [
                'Good'
              ],
              'name': 'Parijs, Parijs, Frankrijk',
              'point': {
                'coordinates': [
                  48.856929779052734,
                  2.341200113296509
                ],
                'type': 'Point'
              }
            }, {
              '__type': 'Location:http://schemas.microsoft.com/search/local/ws/rest/v1',
              'address': {
                'adminDistrict': 'TX',
                'adminDistrict2': 'Lamar Co.',
                'countryRegion': 'Verenigde Staten',
                'formattedAddress': 'Paris, TX',
                'locality': 'Paris'
              },
              'bbox': [
                33.612632751464844, -95.66138458251953,
                33.716548919677734, -95.4593734741211
              ],
              'confidence': 'High',
              'entityType': 'PopulatedPlace',
              'geocodePoints': [{
                'calculationMethod': 'Rooftop',
                'coordinates': [
                  33.66128158569336, -95.56356048583984
                ],
                'type': 'Point',
                'usageTypes': [
                  'Display'
                ]
              }],
              'matchCodes': [
                'Good'
              ],
              'name': 'Paris, TX',
              'point': {
                'coordinates': [
                  33.66128158569336, -95.56356048583984
                ],
                'type': 'Point'
              }
            }, {
              '__type': 'Location:http://schemas.microsoft.com/search/local/ws/rest/v1',
              'address': {
                'adminDistrict': 'ON',
                'adminDistrict2': 'Brant',
                'countryRegion': 'Canada',
                'formattedAddress': 'Paris, ON',
                'locality': 'Paris'
              },
              'bbox': [
                43.179569244384766, -80.39591217041016,
                43.20668411254883, -80.36907196044922
              ],
              'confidence': 'High',
              'entityType': 'PopulatedPlace',
              'geocodePoints': [{
                'calculationMethod': 'Rooftop',
                'coordinates': [
                  43.190670013427734, -80.38166809082031
                ],
                'type': 'Point',
                'usageTypes': [
                  'Display'
                ]
              }],
              'matchCodes': [
                'Good'
              ],
              'name': 'Paris, ON',
              'point': {
                'coordinates': [
                  43.190670013427734, -80.38166809082031
                ],
                'type': 'Point'
              }
            }, {
              '__type': 'Location:http://schemas.microsoft.com/search/local/ws/rest/v1',
              'address': {
                'adminDistrict': 'TN',
                'adminDistrict2': 'Henry Co.',
                'countryRegion': 'Verenigde Staten',
                'formattedAddress': 'Paris, TN',
                'locality': 'Paris'
              },
              'bbox': [
                36.28313064575195, -88.35446166992188,
                36.324832916259766, -88.29332733154297
              ],
              'confidence': 'High',
              'entityType': 'PopulatedPlace',
              'geocodePoints': [{
                'calculationMethod': 'Rooftop',
                'coordinates': [
                  36.3018798828125, -88.32588195800781
                ],
                'type': 'Point',
                'usageTypes': [
                  'Display'
                ]
              }],
              'matchCodes': [
                'Good'
              ],
              'name': 'Paris, TN',
              'point': {
                'coordinates': [
                  36.3018798828125, -88.32588195800781
                ],
                'type': 'Point'
              }
            }, {
              '__type': 'Location:http://schemas.microsoft.com/search/local/ws/rest/v1',
              'address': {
                'adminDistrict': 'IL',
                'adminDistrict2': 'Edgar Co.',
                'countryRegion': 'Verenigde Staten',
                'formattedAddress': 'Paris, IL',
                'locality': 'Paris'
              },
              'bbox': [
                39.59203338623047, -87.71569061279297,
                39.631813049316406, -87.6775131225586
              ],
              'confidence': 'High',
              'entityType': 'PopulatedPlace',
              'geocodePoints': [{
                'calculationMethod': 'Rooftop',
                'coordinates': [
                  39.614688873291016, -87.69503784179688
                ],
                'type': 'Point',
                'usageTypes': [
                  'Display'
                ]
              }],
              'matchCodes': [
                'Good'
              ],
              'name': 'Paris, IL',
              'point': {
                'coordinates': [
                  39.614688873291016, -87.69503784179688
                ],
                'type': 'Point'
              }
            }]
          }],
          'statusCode': 200,
          'statusDescription': 'OK',
          'traceId': 'db9a99b9ffa3433ea03ab62685db1a46|BN20130521|02.00.163.2700|BN2SCH020170836, i-3961fe90.us-east-1b, BN2SCH020200817'
        };
        this.$httpBackend.whenJSONP(url).respond(expectedResponse);

        var promise = service.geocode('paris');

        var resources;
        promise.then(function(value) {
          resources = value;
        });

        this.$httpBackend.flush();

        expect(resources).toEqual([]);
      });
    });


    describe('when bing server response with location which are inside bounding box', function() {
      it('should return array of resources', function() {
        var url = 'http://dev.virtualearth.net/REST/v1/Locations?jsonp=JSON_CALLBACK&q=pernis&key=Am6kAyf_AScih8y3ElNRSDpQ9xMJ8jn4yeePDKdHzhsNU4u7Jm-Ac8LJooYKmhbY&c=nl';
        var expectedResponse = {
          'authenticationResultCode': 'ValidCredentials',
          'brandLogoUri': 'http:\/\/dev.virtualearth.net\/Branding\/logo_powered_by.png',
          'copyright': 'Copyright © 2015 Microsoft and its suppliers. All rights reserved. This API cannot be accessed and the content and any results may not be used, reproduced or transmitted in any manner without express written permission from Microsoft Corporation.',
          'resourceSets': [{
            'estimatedTotal': 1,
            'resources': [{
              '__type': 'Location:http:\/\/schemas.microsoft.com\/search\/local\/ws\/rest\/v1',
              'bbox': [51.879447937011719, 4.3761205673217773, 51.89508056640625, 4.3962612152099609],
              'name': 'Pernis, Netherlands',
              'point': {
                'type': 'Point',
                'coordinates': [51.889228820800781, 4.3876199722290039]
              },
              'address': {
                'adminDistrict': 'South Holland',
                'adminDistrict2': 'Rotterdam',
                'countryRegion': 'Netherlands',
                'formattedAddress': 'Pernis, Netherlands',
                'locality': 'Pernis'
              },
              'confidence': 'High',
              'entityType': 'PopulatedPlace',
              'geocodePoints': [{
                'type': 'Point',
                'coordinates': [51.889228820800781, 4.3876199722290039],
                'calculationMethod': 'Rooftop',
                'usageTypes': ['Display']
              }],
              'matchCodes': ['Good']
            }]
          }],
          'statusCode': 200,
          'statusDescription': 'OK',
          'traceId': '96bd0244f21d437cb03ba9814cadc0af|DB40170257|02.00.163.2700|DB4SCH010061257, BN2SCH020201526'
        };
        this.$httpBackend.whenJSONP(url).respond(expectedResponse);

        var promise = service.geocode('pernis');

        var resources;
        promise.then(function(value) {
          resources = value;
        });

        this.$httpBackend.flush();

        var expected = expectedResponse.resourceSets[0].resources;
        expect(resources).toEqual(expected);
      });
    });

    describe('when bing server response with location which are in and outside bounding box', function() {
      it('should return array of resources within the bounding box', function() {
        var url = 'http://dev.virtualearth.net/REST/v1/Locations?jsonp=JSON_CALLBACK&q=willemstad&key=Am6kAyf_AScih8y3ElNRSDpQ9xMJ8jn4yeePDKdHzhsNU4u7Jm-Ac8LJooYKmhbY&c=nl';
        var expectedResponse = {
          'authenticationResultCode': 'ValidCredentials',
          'brandLogoUri': 'http://dev.virtualearth.net/Branding/logo_powered_by.png',
          'copyright': 'Copyright © 2015 Microsoft and its suppliers. All rights reserved. This API cannot be accessed and the content and any results may not be used, reproduced or transmitted in any manner without express written permission from Microsoft Corporation.',
          'resourceSets': [{
            'estimatedTotal': 2,
            'resources': [{
              '__type': 'Location:http://schemas.microsoft.com/search/local/ws/rest/v1',
              'address': {
                'countryRegion': 'Curaçao',
                'formattedAddress': 'Willemstad, Curaçao',
                'locality': 'Willemstad'
              },
              'bbox': [
                12.104466438293457, -68.94246673583984,
                12.113123893737793, -68.92652893066406
              ],
              'confidence': 'High',
              'entityType': 'PopulatedPlace',
              'geocodePoints': [{
                'calculationMethod': 'Rooftop',
                'coordinates': [
                  12.112070083618164, -68.93601989746094
                ],
                'type': 'Point',
                'usageTypes': [
                  'Display'
                ]
              }],
              'matchCodes': [
                'Good'
              ],
              'name': 'Willemstad, Curaçao',
              'point': {
                'coordinates': [
                  12.112070083618164, -68.93601989746094
                ],
                'type': 'Point'
              }
            }, {
              '__type': 'Location:http://schemas.microsoft.com/search/local/ws/rest/v1',
              'address': {
                'adminDistrict': 'Noord-Brabant',
                'adminDistrict2': 'Moerdijk',
                'countryRegion': 'Nederland',
                'formattedAddress': 'Willemstad, Nederland',
                'locality': 'Willemstad'
              },
              'bbox': [
                51.687313079833984,
                4.4363298416137695,
                51.69664764404297,
                4.445643424987793
              ],
              'confidence': 'High',
              'entityType': 'PopulatedPlace',
              'geocodePoints': [{
                'calculationMethod': 'Rooftop',
                'coordinates': [
                  51.69401931762695,
                  4.440179824829102
                ],
                'type': 'Point',
                'usageTypes': [
                  'Display'
                ]
              }],
              'matchCodes': [
                'Good'
              ],
              'name': 'Willemstad, Nederland',
              'point': {
                'coordinates': [
                  51.69401931762695,
                  4.440179824829102
                ],
                'type': 'Point'
              }
            }]
          }],
          'statusCode': 200,
          'statusDescription': 'OK',
          'traceId': 'e48b662f974644a4b0ffcccbb6679d78|BN20320621|02.00.163.2700|BN2SCH020131130'
        };
        this.$httpBackend.whenJSONP(url).respond(expectedResponse);

        var promise = service.geocode('willemstad');

        var resources;
        promise.then(function(value) {
          resources = value;
        });

        this.$httpBackend.flush();

        var expected = [expectedResponse.resourceSets[0].resources[1]];
        expect(resources).toEqual(expected);
      });
    });
  });
});
