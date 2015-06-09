(function() {
  'use strict';

  function ExtractionController(ExtractionSelectionService, pattyConf, $http, toastr) {
    this.showForm = false;
    this.selection = ExtractionSelectionService;
    this.email = '';
    this.size = {};

    /**
     * Update size data by requesting it from server.
     */
    this.count = function() {
      var request = this.selection.toRequest();
      var apiEndpoint = pattyConf.AHN_API_ENDPOINT;
      var url = apiEndpoint + '/size';
      $http.post(url, request).success(function(data) {
        this.size = data;
      }.bind(this)).error(function() {
        console.log(arguments);
      });
    };

    /**
     *
     */
    this.submit = function() {
      var request = this.selection.toRequest();
      request.email = this.email;
      request.level = this.size.level || 13;
      var apiEndpoint = pattyConf.AHN_API_ENDPOINT;
      var url = apiEndpoint + '/laz';
      $http.post(url, request).success(function(data) {
        this.size = data;
        toastr.success('Will send e-mail to "' + request.email + '" when completed', 'Point extraction job submitted');
      }.bind(this)).error(function() {
        console.log(arguments);
      });
      this.showForm = false;
    };
  }

  angular.module('pattyApp.extract')
    .controller('ExtractionController', ExtractionController);
})();
