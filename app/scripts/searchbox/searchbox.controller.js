(function() {
  'use strict';

  function SearchPanelController(BingGeoCoderService, SceneService, PathControls, Messagebus, $window, toastr, THREE, proj4) {
    this.query = '';
    this.hasGeoLocation = 'geolocation' in $window.navigator;

    this.clear = function() {
      this.query = '';
    };

    this.onLocationResponse = function(resources) {
      if (resources.length === 0) {
        toastr.warning('No results', 'Location not found');
        return;
      }
      var resource = resources[0];
      this.query = resource.name.replace(', Nederland', '');
      var location = resource.point.coordinates;
      this.gotoLocation(location[1], location[0]);
    };

    this.search = function() {
      BingGeoCoderService.geocode(this.query).then(
        this.onLocationResponse.bind(this),
        function() {
          toastr.error('Search failed', 'for some reason');
        }
      );
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
      var moveOffsetY = -1000;
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
      }.bind(this), function() {
        toastr.error('Unable to get current location');
      });
    };
  }

  angular.module('pattyApp.searchbox')
    .controller('SearchPanelController', SearchPanelController);
})();
