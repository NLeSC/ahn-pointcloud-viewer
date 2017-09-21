(function() {
  'use strict';

  function ExtractionController(ExtractionSelectionService, pattyConf, Messagebus, $http, toastr) {
    this.selection = ExtractionSelectionService;
    this.email = '';
    this.size = {
      coverage: 1,
      returnedPoints: 0,
      rawPoints: 0,
      level: 14
    };
    this.selection.active = false;

    this.togglePanel = function() {
      if (!this.selection.active) {        
        Messagebus.publish('closeOtherPanels', 'extraction');

        this.selection.active = true;
      } else {
        this.selection.active = false;
      }   
    };
    
    this.panelClose = function(event, panelNameToRemainOpen) {
      if (panelNameToRemainOpen !== 'extraction') {
        this.selection.active = false;
      }      
    }.bind(this);

    Messagebus.subscribe('closeOtherPanels', this.panelClose);

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
      var apiEndpoint = pattyConf.AHN_API_ENDPOINT;
      var url = apiEndpoint + '/laz';
      $http.post(url, request).success(function(data) {
        this.size = data;
        toastr.success('Will send e-mail to "' + request.email + '" when completed', 'Point extraction job submitted');
      }.bind(this)).error(function() {
        console.log(arguments);
        toastr.error('Submit failed', 'for some reason');
      });
      this.showForm = false;
    };
  }

  angular.module('pattyApp.extract')
    .controller('ExtractionController', ExtractionController);
})();
