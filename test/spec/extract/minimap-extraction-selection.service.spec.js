'use strict';

describe('extract.MinimapExtractionSelectionService', function() {
  // load the module
  beforeEach(module('pattyApp.extract'));

  var service;
  var ol;

  beforeEach(inject(function(MinimapExtractionSelectionService, ExtractionSelectionService, _ol_) {
    service = MinimapExtractionSelectionService;
    ol = _ol_;
    this.ExtractionSelectionService = ExtractionSelectionService;
    ExtractionSelectionService.left = 88000;
    ExtractionSelectionService.right = 102000;
    ExtractionSelectionService.top = 417880;
    ExtractionSelectionService.bottom = 405345;
  }));

  describe('initial state', function() {
    it('should have no selection features', function() {
      expect(service.source.getFeatures()).toEqual([]);
    });

    it('should have a hidden layer', function() {
      expect(service.layer.getVisible()).toBeFalsy();
    });

    it('should have an inactive draw interaction', function() {
      expect(service.drawer.getActive()).toBeFalsy();
    });

    it('should not be in drawing state', function() {
      expect(service.drawing).toBeFalsy();
    });
  });

  describe('activationChanged() function', function() {
    describe('when activated', function() {
      beforeEach(function() {
        service.activationChanged(null, true);
      });

      it('should have drawn selection from ExtractionSelectionService', function() {
        var selection = service.source.getFeatures()[0];
        var coordinates = selection.getGeometry().getCoordinates();
        var expected = [
          [
            [88000, 436899.97],
            [88000, 405345],
            [102000, 405345],
            [102000, 436899.97],
            [88000, 436899.97]
          ]
        ];
        expect(coordinates).toEqual(expected);
      });

      it('should have a shown layer', function() {
        expect(service.layer.getVisible()).toBeTruthy();
      });

      it('should have an active draw interaction', function() {
        expect(service.drawer.getActive()).toBeTruthy();
      });
    });

    describe('when deactivated', function() {
      beforeEach(function() {
        service.activationChanged(null, true);

        service.activationChanged(null, false);
      });

      it('should have a hidden layer', function() {
        expect(service.layer.getVisible()).toBeFalsy();
      });

      it('should have an inactive draw interaction', function() {
        expect(service.drawer.getActive()).toBeFalsy();
      });
    });
  });

  describe('init() function', function() {
    beforeEach(function() {
      this.map = jasmine.createSpyObj('map', ['addLayer', 'addInteraction']);

      service.init(this.map);
    });

    it('should register layer in map', function() {
      expect(this.map.addLayer).toHaveBeenCalledWith(service.layer);
    });

    it('should register draw interaction', function() {
      expect(this.map.addInteraction).toHaveBeenCalledWith(service.drawer);
    });
  });

  describe('onDrawStart() function', function() {
    beforeEach(function() {
      service.activationChanged(null, true);
    });

    beforeEach(function() {
      service.onDrawStart();
    });

    it('should  be in drawing state', function() {
      expect(service.drawing).toBeTruthy();
    });

    it('should have no selection features', function() {
      expect(service.source.getFeatures()).toEqual([]);
    });
  });

  describe('onDrawEnd() function', function() {
    beforeEach(function() {
      service.activationChanged(null, true);
      service.onDrawStart();
    });

    beforeEach(function() {
      var coordinates = [
        [
          [77000.789, 466899.971524],
          [77000.789, 425345.123],
          [112000.654, 425345.123],
          [112000.654, 466899.971524],
          [77000.789, 466899.971524]
        ]
      ];
      var feature = new ol.Feature({
        geometry: new ol.geom.Polygon(coordinates)
      });
      var interaction = {
        feature: feature
      };
      service.onDrawEnd(interaction);
    });

    it('should not be in drawing state', function() {
      expect(service.drawing).toBeFalsy();
    });

    it('should update extraction selection', function() {
      var sel = this.ExtractionSelectionService.toRequest();
      var expected = {
        left: 77000.79,
        bottom: 425345.12,
        right: 112000.65,
        top: 466899.97
      };
      expect(sel).toEqual(expected);
    });
  });

});
