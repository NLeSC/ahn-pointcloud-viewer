(function() {
  'use strict';

  function MinimapExtractionSelectionService(ExtractionSelectionService, ol, proj4, Messagebus) {
    this.source = new ol.source.Vector({
      wrapX: false
    });

    this.layer = new ol.layer.Vector({
      source: this.source,
      style: new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(255, 255, 255, 0.2)'
        }),
        stroke: new ol.style.Stroke({
          color: '#0f0',
          width: 2
        })
      }),
      visible: false
    });
    this.drawing = false;

    this.geometryFunction = function(coordinates, geometry) {
      if (!geometry) {
        geometry = new ol.geom.Polygon(null);
      }
      var start = coordinates[0];
      var end = coordinates[1];
      geometry.setCoordinates([
        [start, [start[0], end[1]], end, [end[0], start[1]], start]
      ]);
      return geometry;
    };

    this.drawer = new ol.interaction.Draw({
      source: this.source,
      type: 'LineString',
      geometryFunction: this.geometryFunction,
      maxPoints: 2,
      style: new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(255, 255, 255, 0.2)'
        }),
        stroke: new ol.style.Stroke({
          color: '#0f0',
          width: 3
        }),
        // cross as mouse pointer
        image: new ol.style.RegularShape({
          stroke: new ol.style.Stroke({
            color: '#0f0',
            width: 2
          }),
          points: 4,
          radius: 10,
          radius2: 0,
          angle: 0
        })
      })
    });

    this.onDrawStart = function() {
      // only one selection can be drawn at one time
      this.source.clear();
      this.drawing = true;
    };

    this.onDrawEnd = function(interaction) {
      var coordinates = interaction.feature.getGeometry().getCoordinates();

      function round2Dec(value) {
        return Math.round(value * 100) / 100;
      }

      var topright = {
        lon: round2Dec(coordinates[0][3][0]),
        lat: round2Dec(coordinates[0][3][1])
      };
      var bottomleft = {
        lon: round2Dec(coordinates[0][1][0]),
        lat: round2Dec(coordinates[0][1][1])
      };
      ExtractionSelectionService.setTopRightCoordinates(topright);
      ExtractionSelectionService.setBottomLeftCoordinates(bottomleft);
      this.drawing = false;
    };

    this.remoteSelectionChanged = function(event, bbox) {
      if (this.drawing) {
        // dont listen to changes we made ourselves
        return;
      }
      this.drawSelection(bbox);
    };

    this.drawSelection = function(bbox) {
      // resize dragbox
      var coordinates = [
        [
          [
            bbox.left, bbox.top
          ],
          [
            bbox.left, bbox.bottom
          ],
          [
            bbox.right, bbox.bottom
          ],
          [
            bbox.right, bbox.top
          ],
          [
            bbox.left, bbox.top
          ]
        ]
      ];
      var feature = this.source.getFeatures()[0];
      if (feature) {
        var geom = feature.getGeometry();
        geom.setCoordinates(coordinates);
      } else {
        // no selection has been made in minimap before
        feature = new ol.Feature({
          geometry: new ol.geom.Polygon(coordinates)
        });
        this.source.addFeature(feature);
      }
    };

    this.activationChanged = function(event, active) {
      this.layer.setVisible(active);
      this.drawer.setActive(active);
      if (active) {
        // draw existing selection
        this.drawSelection(ExtractionSelectionService);
      }
    };

    this.init = function(map) {
      map.addLayer(this.layer);
      map.addInteraction(this.drawer);
    };

    this.drawer.setActive(false);
    this.drawer.on('drawstart', this.onDrawStart.bind(this));
    this.drawer.on('drawend', this.onDrawEnd.bind(this));
    Messagebus.subscribe('extractionSelectionChanged', this.remoteSelectionChanged.bind(this));
    Messagebus.subscribe('extractionSelectionActivationChanged', this.activationChanged.bind(this));
  }

  angular.module('pattyApp.extract')
    .service('MinimapExtractionSelectionService', MinimapExtractionSelectionService);
})();
