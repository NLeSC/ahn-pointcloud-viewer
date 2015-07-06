(function() {
  'use strict';

  function ExtractionSelectionService(Messagebus, debounce) {
    this._active = false;

    this._left = 93720.22;
    this._bottom = 436899.97;
    this._right = 94428.37;
    this._top = 438334.32;

    this.sendUpdate = debounce(50, function () {
      Messagebus.publish('extractionSelectionChanged', this.toRequest());
    }.bind(this));

    this.updateValue = function(name, newValue) {
      if (newValue !== this[name]) {
        this[name] = newValue;
        // TODO do not swap when whole selection must be set
        // the swapping can overwrite new data with old data
        this.checkSwapCoordinates();
        this.sendUpdate();
      }
    };

    Object.defineProperty(this, 'active', {
      get: function() { return this._active; },
      set: function(newValue) {
        if (newValue !== this._active) {
          Messagebus.publish('extractionSelectionActivationChanged', newValue);
        }
        this._active = newValue;
      }
    });

    Object.defineProperty(this, 'left', {
      get: function() { return this._left; },
      set: function(newValue) {
        this.updateValue('_left', newValue);
      }
    });

    Object.defineProperty(this, 'top', {
      get: function() { return this._top; },
      set: function(newValue) {
        this.updateValue('_top', newValue);
      }
    });

    Object.defineProperty(this, 'right', {
      get: function() { return this._right; },
      set: function(newValue) {
        this.updateValue('_right', newValue);
      }
    });

    Object.defineProperty(this, 'bottom', {
      get: function() { return this._bottom; },
      set: function(newValue) {
        this.updateValue('_bottom', newValue);
      }
    });

    this.checkSwapCoordinates = function() {
      var temp = -1;
      if (this._bottom > this._top) {
        temp = this._top;
        this._top = this._bottom;
        this._bottom = temp;
      }
      if (this._left > this._right) {
        temp = this._right;
        this._right = this._left;
        this._left = temp;
      }
    };

    this.setBottomLeftCoordinates = function(coords) {
      this.bottom = coords.lat;
      this.left = coords.lon;
    };

    this.setTopRightCoordinates = function(coords) {
      this.top = coords.lat;
      this.right = coords.lon;
    };

    this.toRequest = function() {
      var request = {
        left: this._left,
        bottom: this._bottom,
        right: this._right,
        top: this._top
      };
      return request;
    };
  }

  angular.module('pattyApp.extract').service('ExtractionSelectionService', ExtractionSelectionService);
})();
