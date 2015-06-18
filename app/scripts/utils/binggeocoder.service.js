(function() {
  'use strict';

  /**
   * Bing geocoder.
   *
   * Converts landmark or adress to a geo coordinate.
   *
   */
  function BingGeoCoderService($http) {
    /**
     * Bing maps API key
     * @type {String}
     */
    this.bingMapsKey = 'Am6kAyf_AScih8y3ElNRSDpQ9xMJ8jn4yeePDKdHzhsNU4u7Jm-Ac8LJooYKmhbY';
    /**
     * Culture parameter
     * See https://msdn.microsoft.com/en-us/library/ff701709.aspx for choices.
     * Can be falsy to not have culture
     * @type {String}
     */
    this.culture = 'nl';
    /**
     * Filter locations on bounding box.
     *
     * Locations can not be filtered on country with the bing maps api.
     * So use a crude bounding box to filter out locations outside country.
     *
     * @type {Object}
     */
    this.boundingBox = {
      minlon: 3.3700,
      minlat: 50.7500,
      maxlon: 7.2100,
      maxlat: 53.4700
    };

    this.geocodeUrl = function(query) {
      var url = 'http://dev.virtualearth.net/REST/v1/Locations?';
      url = url + 'jsonp=JSON_CALLBACK';
      url = url + '&q=' + query;
      url = url + '&key=' + this.bingMapsKey;
      if (this.culture) {
        url = url + '&c=' + this.culture;
      }
      return url;
    };

    /**
     * Fetch coordinate of a location query.
     * See https://msdn.microsoft.com/en-us/library/ff701725.aspx for resources format
     *
     * @param  {string} query  The landmark or adress
     * @return {Promise}       Promise will be resolved with resources array
     */
    this.geocode = function(query) {
      var url = this.geocodeUrl(query);
      var bbox = this.boundingBox;

      return $http.jsonp(url).then(function(response) {
        var allResources = response.data.resourceSets[0].resources;

        // filter resources on bounding box
        var boxedResources = allResources.filter(function(resource) {
          var lat = resource.point.coordinates[0];
          var lon = resource.point.coordinates[1];
          return (bbox.minlat <= lat && lat <= bbox.maxlat) &&
            (bbox.minlon <= lon && lon <= bbox.maxlon);
        });
        return boxedResources;
      });
    };
  }

  angular.module('pattyApp.utils')
    .service('BingGeoCoderService', BingGeoCoderService);
})();
