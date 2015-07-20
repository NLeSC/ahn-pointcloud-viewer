(function() {
  'use strict';

  function MinimapController(ol, proj4, CamFrustumService, Messagebus, MinimapExtractionSelectionService) {
    proj4.defs('EPSG:28992','+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +no_defs');

    var projection = ol.proj.get('EPSG:28992');
    var projectionExtent = [-285401.92,22598.08,595401.9199999999,903401.9199999999];

    var resolutions = [3440.64, 1720.32, 860.16, 430.08, 215.04, 107.52, 53.76, 26.88, 13.44, 6.72, 3.36, 1.68, 0.84, 0.42];
    var matrixIds = new Array(14);
    for (var z = 0; z < 15; ++z) {
      // generate resolutions and matrixIds arrays for this WMTS
      matrixIds[z] = 'EPSG:28992:' + z;
    }

    var matrixIdsLuchtfotos = new Array(14);
    for (var n = 0; n < 15; ++n) {
      // generate resolutions and matrixIds arrays for this WMTS
      if (n<10) {
        matrixIdsLuchtfotos[n] = '0' + n;
      } else {
        matrixIdsLuchtfotos[n] = '' + n;
      }
    }

    var projectionNL = ol.proj.get('EPSG:28992');
    projectionNL.setExtent([646.36, 308975.28, 276050.82, 636456.31]);

    //var Rotterdam = ol.proj.transform([4.5000, 51.9167], 'EPSG:4326', 'EPSG:28992');
    var startLocation = ol.proj.transform([4.451,51.777], 'EPSG:4326', 'EPSG:28992');

    this.osmLayer = {};

    var baseLayers = new ol.layer.Group({
      'title': 'Base maps',
      layers: [
        new ol.layer.Tile({
          title: 'NederlandBRT',
          type: 'base',
          visible: true,
          extent: projectionExtent,
          source: new ol.source.WMTS({
            //http://geodata.nationaalgeoregister.nl/tiles/service/wmts/aan?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=aan&STYLE=_null&TILEMATRIXSET=EPSG%3A28992&TILEMATRIX=EPSG%3A28992%3A8&TILEROW=129&TILECOL=127&FORMAT=image%2Fpng
            //http://geodata.nationaalgeoregister.nl/tiles/service/wmts/brtachtergrondkaart?Layer=brtachtergrondkaart&style=default&Style=default&TileMatrixSet=EPSG%3A28992&Service=WMTS&Request=GetTile&Version=1.0.0&Format=png8&TileMatrix=0&TileCol=0&TileRow=0
            //http://geodata.nationaalgeoregister.nl/tiles/service/wmts/brtachtergrondkaart?SERVICE=WMTS&Request=GetTile&VERSION=1.0.0&LAYER=brtachtergrondkaart&STYLE=default&TILEMATRIXSET=EPSG%3A28992&TILEMATRIX=EPSG%3A28992%3A8&TILEROW=0&TILECOL=0&FORMAT=image%2Fpng8
            //http://geodata.nationaalgeoregister.nl/tiles/service/wmts/brtachtergrondkaart?Layer=brtachtergrondkaart&style=default&Style=default&TileMatrixSet=EPSG%3A28992&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG%3A28992%3A2&TileCol=2&TileRow=4
            url: 'http://geodata.nationaalgeoregister.nl/tiles/service/wmts/brtachtergrondkaart',
            layer: 'brtachtergrondkaart',
            matrixSet: 'EPSG:28992',
            format: 'image/png',
            projection: projection,
            tileGrid: new ol.tilegrid.WMTS({
              origin: ol.extent.getTopLeft(projectionExtent),
              resolutions: resolutions,
              matrixIds: matrixIds
            })
          })
        }),
        this.osmLayer = new ol.layer.Tile({
          title: 'Luchtfotos',
          type: 'base',
          visible: false,
          source: new ol.source.WMTS({
            url: 'http://geodata1.nationaalgeoregister.nl/luchtfoto/wmts',
            layer: 'luchtfoto',
            matrixSet: 'nltilingschema',
            format: 'image/jpeg',
            projection: projection,
            tileGrid: new ol.tilegrid.WMTS({
              origin: ol.extent.getTopLeft(projectionExtent),
              resolutions: resolutions,
              matrixIds: matrixIdsLuchtfotos
            }),
            style: 'default'
          })
        })
      ]
    });

    //this.osmLayer.on('postcompose', function(event) {
    //  console.log('postcompose');
		//	project();
		//});

    this.map = new ol.Map({
      maxExtent: projectionExtent,
      layers: baseLayers,
      //target: 'map',
      theme: null,
      maxResolution: 860.16,
      numZoomLevels: 12,
      units: 'm',
      displayProjection: projection,
      view: new ol.View({
        center: startLocation,
        zoom: 14
      })
    });

    this.setupResizeControl = function() {
      function ResizeControl(optOptions) {
        var options = optOptions || {};

        var button = document.createElement('button');
        button.innerHTML = '<span class="glyphicon glyphicon-resize-full"></span>';

        var this_ = this;
        var maximized = false;
        var clickOnResize = function() {
          maximized = !maximized;

          if (maximized) {
            this_.getMap().getTarget().classList.add('big-minimap');
            button.innerHTML = '<span class="glyphicon glyphicon-resize-small"></span>';
          } else {
            this_.getMap().getTarget().classList.remove('big-minimap');
            button.innerHTML = '<span class="glyphicon glyphicon-resize-full"></span>';
          }
          this_.getMap().updateSize();
        };

        button.addEventListener('click', clickOnResize, false);
        button.addEventListener('touchstart', clickOnResize, false);

        var element = document.createElement('div');
        element.className = 'resize-minimap ol-unselectable ol-control';
        element.appendChild(button);

        ol.control.Control.call(this, {
          element: element,
          target: options.target
        });
      }
      ol.inherits(ResizeControl, ol.control.Control);

      this.map.addControl(new ResizeControl());
    };
    this.setupResizeControl();

    var layerSwitcher = new ol.control.LayerSwitcher({
      tipLabel: 'Legend'
    });
    this.map.addControl(layerSwitcher);

    this.map.addLayer(CamFrustumService.layer);

    this.centerMap = function(center) {
      this.map.getView().setCenter(center);
    };

    this.updateFrustrumAndCenterMap = function(event, frustum) {
      CamFrustumService.onCameraMove(frustum);

      // TODO center of bottom of frustrum + zoom on bottom of frustum
      // var extent = CamFrustumService.camFrustum;
      // console.log(extent);
      // this.map.getView().fit(extent);
      var pos = CamFrustumService.getCameraPosition();
      this.centerMap(pos);
    };

    Messagebus.subscribe('cameraMoved', this.updateFrustrumAndCenterMap.bind(this));

    MinimapExtractionSelectionService.init(this.map);
  }

  angular.module('pattyApp.minimap')
    .controller('MinimapController', MinimapController);
})();
