(function() {
  'use strict';

  function MaximapService(ol, proj4, THREE) {
    proj4.defs('EPSG:28992','+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +no_defs');

    var projection = new ol.proj.Projection('EPSG:28992');
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

    var Rotterdam = ol.proj.transform([4.5000, 51.9167], 'EPSG:4326', 'EPSG:28992');
    //console.log('Rotterdam: ' + Rotterdam);

    var baseLayers = new ol.layer.Group({
      'title': 'Base maps',
      layers: [
        this.luchtfotoLayer = new ol.layer.Tile({
          title: 'Luchtfotos',
          type: 'base',
          visible: true,
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

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');

    canvas.width = 1024;
    canvas.height = 1024;
    context.fillStyle = '#000000';
    context.fillRect( 0, 0, canvas.width, canvas.height );

    this.initMap = function() {
      this.map = new ol.Map({
        maxExtent: projectionExtent,
        layers: baseLayers,
        target: 'canvas',
        theme: null,
        maxResolution: 860.16,
        numZoomLevels: 12,
        units: 'm',
        displayProjection: projection,
        view: new ol.View({
          center: Rotterdam,
          zoom: 14
        }),
        renderer: 'canvas'
      });

      this.map.on('render', function(event) {
        console.log('render');
      });
    };   

    this.addToMesh = function(mesh) {
      this.initMap();

      this.texture = new THREE.Texture(canvas);
      this.texture.minFilter = THREE.LinearFilter;
      this.texture.magFilter = THREE.LinearFilter;
      this.texture.needsUpdate = true;

      this.mesh = mesh;
      this.mesh.material = new THREE.MeshBasicMaterial({	map : this.texture, overdraw: true, side:THREE.DoubleSide	});
    };

    this.update = function() {
      if (this.texture !== undefined) {
        this.mesh.material.map.dispose();
        var texture = new THREE.Texture(canvas);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;

        this.map.updateSize();

  			var view = this.map.getView();

  			var res = view.getResolutionForExtent(projectionExtent, [1024,1024]);
  			view.setResolution(res);

        texture.needsUpdate = true;

        this.mesh.material.map = texture;
        //if (this.mesh.material.texture) {
        //  this.mesh.material.texture.dispose();
        //}

        //var viewport = this.map.getViewport();
  		  //var canvas = viewport.getElementsByTagName('canvas')[0];
  		  //var canvas = document.createElement('map_canvas');
        //this.texture = new THREE.Texture(canvas);
        //this.texture.needsUpdate = true;
        //this.mesh.material.texture = this.texture;
      }
    };

    this.render = function() {
      this.map.render();
      //context.drawImage( video, 0, 0 );
    };
  }

  angular.module('pattyApp.maximap')
    .service('MaximapService', MaximapService);
})();
