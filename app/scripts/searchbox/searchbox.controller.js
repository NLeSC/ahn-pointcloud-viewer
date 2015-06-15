(function() {
  'use strict';

  function SearchPanelController(SceneService, PathControls, Messagebus, $http, $window, toastr, THREE, proj4) {
    this.query = '';
    this.bingMapsKey = 'Am6kAyf_AScih8y3ElNRSDpQ9xMJ8jn4yeePDKdHzhsNU4u7Jm-Ac8LJooYKmhbY';
    this.hasGeoLocation = 'geolocation' in $window.navigator;

    this.clear = function() {
      this.query = '';
    };

    this.onLocationResponse = function(data) {
      if (data.resourceSets[0].estimatedTotal === 0) {
        toastr.warning('No results', 'Location not found');
        return;
      }
      // only interested in location in Netherlands
      if (data.resourceSets[0].resources[0].address.countryRegionIso2 !== 'NL') {
        toastr.warning('Search failed', 'Location not in Netherlands');
        return;
      }

      this.query = data.resourceSets[0].resources[0].name.replace(', Netherlands', '');
      var location = data.resourceSets[0].resources[0].geocodePoints[0].coordinates;

      this.gotoLocation(location[1], location[0]);
    };

    this.search = function() {
      var url = 'http://dev.virtualearth.net/REST/v1/Locations?';
      url = url + 'incl=ciso2&jsonp=JSON_CALLBACK';
      url = url + '&q=' + this.query;
      url = url + '&key=' + this.bingMapsKey;
      // Limit search results by bounding box
      // See https://msdn.microsoft.com/en-us/library/ff701704.aspx
      var searchBoundaries = [
        3.3700, 50.7500, 7.2100, 53.4700
      ];
      url = url + '&umv=' + searchBoundaries.join(',');
      $http.jsonp(url).success(this.onLocationResponse.bind(this)).error(function() {
        toastr.error('Search failed', 'for some reason');
      });
    };

    /**
     * When enter is pressed inside input field perform a search
     */
    this.onQueryKeyPress = function($event) {
      var enterCode = 13;
      if ($event.keyCode === enterCode) {
        this.search();
      }
    };

    this.gotoLocation = function(longitude, latitude) {
      var altitude = 0;
      var bingProjection = 'EPSG:4326';
      var bingLocation = [longitude, latitude];
      var nlProjection = 'EPSG:28992';

      // look at location
      var geoLocation = proj4(bingProjection, nlProjection, bingLocation);
      var geoVector = new THREE.Vector3(geoLocation[0], geoLocation[1], altitude);
      var sceneLocation = SceneService.toLocal(geoVector);

      // move camera to location
      var moveOffsetX = 0;
      var moveOffsetY = 1000;
      var moveOffsetZ = 1000;
      var geoLocationMove = [geoLocation[0] + moveOffsetX, geoLocation[1] + moveOffsetY];
      var sceneLocationMove = SceneService.toLocal(new THREE.Vector3(geoLocationMove[0], geoLocationMove[1], altitude + moveOffsetZ));

      PathControls.moveTo(sceneLocationMove);
      PathControls.lookat(sceneLocation);
    };

    this.gotoCurrentLocation = function() {
      $window.navigator.geolocation.getCurrentPosition(function(position) {
        var c = position.coords;
        this.gotoLocation(c.longitude, c.latitude);
      }, function() {
        toastr.error('Unable to get current location');
      });
    };
  }

  angular.module('pattyApp.searchbox')
    .controller('SearchPanelController', SearchPanelController);
})();
