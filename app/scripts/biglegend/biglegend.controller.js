(function() {
  'use strict';

  function BigLegendController($scope, DecimalAdjust, Messagebus, UserAgent, PointcloudService) {
    this.PointcloudService = PointcloudService;

    this.mobile = UserAgent.mobile;

    this.logarithmic = false;
    Messagebus.subscribe('logarithmicChange', function(event, value) {
      this.logarithmic = value;
      this.setLegendText();
    }.bind(this));

    this.legendText = [40, 30, 20, 10];

    //Define the legend max initial value
    this.legendMin = PointcloudService.settings.heightMin;

    // Set watcher for change on the legend min setting, use it to publish changes.
    $scope.$watch('blc.legendMin', function(newValue, oldValue) {
      if (newValue === oldValue) {
        //Initialization, so we ignore this event.
      } else {
        this.setLegendText();
        PointcloudService.settings.heightMin = newValue;
      }
    }.bind(this));

    //Define the legend max initial value
    this.legendMax = PointcloudService.settings.heightMax;

    // Set watcher for change on the legend max setting, use it to publish changes.
    $scope.$watch('blc.legendMax', function(newValue, oldValue) {
      if (newValue === oldValue) {
        //Initialization, so we ignore this event.
      } else {
        this.setLegendText();
        PointcloudService.settings.heightMax = newValue;
      }
    }.bind(this));

    Messagebus.subscribe('ncwmsPaletteSelected', function(event, value) {
      this.setOnload(value.graphic);
    }.bind(this));


    this.selectedUnits = 'meters above sea level';
    Messagebus.subscribe('ncwmsUnitsChange', function(event, value) {
      this.selectedUnits = value;
    }.bind(this));

    this.setLegendText = function() {
      var diff = this.legendMax - this.legendMin;
      var interval = 0.2 * diff;

      if (!this.logarithmic) {
        this.legendText[3] = Math.round10((this.legendMin + interval), -2);
        this.legendText[2] = Math.round10((this.legendMin + 2 * interval), -2);
        this.legendText[1] = Math.round10((this.legendMin + 3 * interval), -2);
        this.legendText[0] = Math.round10((this.legendMin + 4 * interval), -2);
      } else {
        var logmin = Math.log10(this.legendMin);
        var logmax = Math.log10(this.legendMax);

        this.legendText[3] = Math.round10((Math.pow(10, 0.8 * logmin + 0.2 * logmax)), -2);
        this.legendText[2] = Math.round10((Math.pow(10, 0.6 * logmin + 0.4 * logmax)), -2);
        this.legendText[1] = Math.round10((Math.pow(10, 0.4 * logmin + 0.6 * logmax)), -2);
        this.legendText[0] = Math.round10((Math.pow(10, 0.2 * logmin + 0.8 * logmax)), -2);
      }
    }.bind(this);

    this.setOnload = function(imgURL) {
      var context = document.getElementById('bigLegendCanvas').getContext('2d');
      var img = new Image();
      img.src = imgURL;

      img.onload = function() {
        context.canvas.width = 5;
        context.canvas.height = 255;

        context.drawImage(img, 0, 0);
      };
    };

    /**
     * Generates a look-up texture for gradient values (height, intensity, ...)
     *
     */
    this.generateLegendTexture = function(gradient, width, height) {
    	// create canvas
    	var canvas = document.createElement( 'canvas' );
    	canvas.width = width;
    	canvas.height = height;

    	// get context
    	var context = canvas.getContext( '2d' );

    	// draw gradient
    	context.rect( 0, 0, width, height );
    	var ctxGradient = context.createLinearGradient( 0, height, width, 0 );

    	for(var i = 0;i < gradient.length; i++){
    		var step = gradient[i];

    		ctxGradient.addColorStop(step[0], '#' + step[1].getHexString());
    	}

    	context.fillStyle = ctxGradient;
    	context.fill();

    	return context;
    };

    this.setTexture = function(gradient) {
      var context = document.getElementById('bigLegendCanvas').getContext('2d');
      var img = new Image();
      var imageDataContext = this.generateLegendTexture(gradient, 1, 255);

      img.src = imageDataContext.canvas.toDataURL();

      img.onload = function() {
        context.canvas.width = 1;
        context.canvas.height = 255;

        context.drawImage(img, 0, 0);
      };
    };

    Messagebus.subscribe('legendTexture change', function(event, value) {
      this.setTexture(value);
    }.bind(this));

    //this.setOnload('images/rainbow_colormap.png');
  }

  angular.module('pattyApp.biglegend').controller('BigLegendController', BigLegendController);
})();
