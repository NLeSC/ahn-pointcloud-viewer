(function() {
  'use strict';

  function ExtractionController(ExtractionSelectionService, MeasuringService, SceneService, THREE, pattyConf, $http, toastr, $rootScope) {
    var scope = this;
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
        toastr.error('Submit failed', 'for some reason');
      });
      this.showForm = false;
    };

    this.color = new THREE.Color( 0xffffff );

    function setSelectionGeometry(zCoord) {
      var leftTopLocal     = SceneService.toLocal({x:scope.selection.left,  y: scope.selection.top, z:zCoord});
      var rightTopLocal    = SceneService.toLocal({x:scope.selection.right, y: scope.selection.top, z:zCoord});
      var rightBottomLocal = SceneService.toLocal({x:scope.selection.right, y: scope.selection.bottom, z:zCoord});
      var leftBottomLocal  = SceneService.toLocal({x:scope.selection.left,  y: scope.selection.bottom, z:zCoord});

      var points = [];
      var edges = [];

      points.add(leftTopLocal);
      points.add(rightTopLocal);
      points.add(rightBottomLocal);
      points.add(leftBottomLocal);

      var edge, i, i2;

      if (edges.length === 0) {
        for (i = 0; i < points.length; i++) {
          i2 = i+1;
          if (i2 > points.length) {
            i2 = 0;
          }

          var lineGeometry = new THREE.Geometry();
    			lineGeometry.vertices.push(new THREE.Vector3(), new THREE.Vector3());
    			lineGeometry.colors.push(scope.color, scope.color, scope.color);
    			var lineMaterial = new THREE.LineBasicMaterial( {
    				linewidth: 1
    			});
    			lineMaterial.depthTest = false;
    			edge = new THREE.Line(lineGeometry, lineMaterial);

          edges.add(edge);
        }
      }

      for (i = 0; i < points.length; i++) {
        i2 = i+1;
        if (i2 > points.length) {
          i2 = 0;
        }
        edge = edges[i];

        edge.geometry.vertices[0].copy(points[i]);
        edge.geometry.vertices[1].copy(points[i2]);

        edge.geometry.verticesNeedUpdate = true;
        edge.geometry.computeBoundingSphere();

        edge.visible = true;
      }
    }

    function setBottomLeftCallback(coordinates) {
      var result = SceneService.toGeo(coordinates);
      scope.selection.setBottomLeftCoordinates({
        lat:parseFloat(result.y.toFixed(2)),
        lon:parseFloat(result.x.toFixed(2))
      });
      $rootScope.$digest();

			this.add(edge);
			this.edges.push(edge);
    }

    function setTopRightCallback(coordinates) {
      var result = SceneService.toGeo(coordinates);
      scope.selection.setTopRightCoordinates({
        lat:parseFloat(result.y.toFixed(2)),
        lon:parseFloat(result.x.toFixed(2))
      });
      $rootScope.$digest();
    }

    this.setBottomLeft = function() {
      MeasuringService.tools.measuring.requestClickLocation(setBottomLeftCallback);
    };

    this.setTopRight = function() {
      MeasuringService.tools.measuring.requestClickLocation(setTopRightCallback);
    };
  }

  angular.module('pattyApp.extract')
    .controller('ExtractionController', ExtractionController);
})();
