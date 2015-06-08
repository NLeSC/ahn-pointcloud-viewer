'use strict';

describe('core.SitesService', function() {
  var SitesService;
  var sitesjson;

  // load the module
  beforeEach(module('pattyApp.core', 'mockedSites'));

  beforeEach(function() {
    inject(function(defaultSitesJSON) {
      sitesjson = defaultSitesJSON;
    });
  });

  describe('load() function', function() {
    var $httpBackend;

    beforeEach(function() {
      inject(function($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $httpBackend.when('GET', 'http://148.251.106.132:8090/POTREE/CONF.json').respond(sitesjson);
        SitesService = $injector.get('SitesService');
      });
    });

    it('should fetch json file', function() {
      SitesService.load();

      $httpBackend.expectGET('http://148.251.106.132:8090/POTREE/CONF.json');
      $httpBackend.flush();
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();

      expect(SitesService.all).toEqual(sitesjson);
      expect(SitesService.filtered).toEqual(sitesjson);
    });

    it('should resolve the ready promise', function() {
      var readyListener = jasmine.createSpy('listener');
      SitesService.ready.then(readyListener);

      SitesService.load();
      // resolve http request
      $httpBackend.flush();

      expect(readyListener).toHaveBeenCalledWith(sitesjson);
    });

    it('should have published a "sitesChanged" event', inject(function(Messagebus) {
      var listener = jasmine.createSpy('listener');
      var unsubscriber = Messagebus.subscribe('sitesChanged', listener);

      SitesService.load();
      // resolve http request
      $httpBackend.flush();

      expect(listener).toHaveBeenCalled();

      unsubscriber();
    }));
  });

  describe('when sites have been loaded', function() {
    var site162json;

    beforeEach(function() {
      inject(function($injector) {
        site162json = sitesjson[0];
        SitesService = $injector.get('SitesService');
        SitesService.onLoad(sitesjson);
      });
    });

    describe('set query property', function() {

      it('should have empty search result when query is empty', function() {
        SitesService.query = '';

        var result = SitesService.searched;
        expect(result).toEqual([]);
      });

      it('should have full filtered result when query is empty', function() {
        SitesService.query = '';

        var result = SitesService.filtered;
        expect(result).toEqual(sitesjson);
      });

      it('should have site1 as search result when query is `site:162`', function() {
        SitesService.query = 'site:162';

        var result = SitesService.searched;
        expect(result).toEqual([site162json]);
      });

      it('should have site1 as filtered result when query is `site:162`', function() {
        SitesService.query = 'site:162';

        var result = SitesService.filtered;
        expect(result).toEqual([site162json]);
      });

      it('should return site1 when query is pyramid', function() {
        SitesService.query = 'pyramid';

        var result = SitesService.searched;
        expect(result).toEqual([site162json]);
      });

      it('should have published a "sitesChanged" event', inject(function(Messagebus) {
        var listener = jasmine.createSpy('listener');
        var unsubscriber = Messagebus.subscribe('sitesChanged', listener);

        SitesService.query = 'pyramid';

        expect(listener).toHaveBeenCalled();

        unsubscriber();
      }));
    });

    describe('a site with a pointcloud', function() {
      var site;
      beforeEach(function() {
        var minlon = 296247.24644;
        var minlat = 4633726.19264;
        var minalt = 121.484;
        var maxlon = 296264.38777;
        var maxlat = 4633743.16827;
        var maxalt = 144.177;
        var bbox = [minlon, minlat, minalt, maxlon, maxlat, maxalt];
        site = {
          pointcloud: [{
            'bbox': bbox
          }]
        };
      });

      describe('centerOfSite() function', function() {
        it('should return center of bounding box of pointcloud', function() {
          var result = SitesService.centerOfSite(site);

          var expected = [296255.817105, 4633734.680455, 132.8305];
          expect(result).toEqual(expected);
        });
      });

      describe('getBoundingBox() function', function() {
        it('should return bounding box of pointcloud', function() {
          var result = SitesService.getBoundingBox(site);

          var expected = [296247.24644, 4633726.19264, 121.484, 296264.38777, 4633743.16827, 144.177];
          expect(result).toEqual(expected);
        });
      });

      describe('getBoundingBoxSize() function', function() {
        it('should return size of bounding box of pointcloud', function() {
          var result = SitesService.getBoundingBoxSize(site);

          var expected = [8.570664999977453, 8.487815000116825, 11.346499999999999];
          expect(result).toEqual(expected);
        });
      });
    });

    describe('a site with footprint only', function() {
      var site;
      beforeEach(function() {
        site = {
          'footprint': [
            [
              [
                [
                  296253.22531720903,
                  4633726.7096176799
                ],
                [
                  296246.09928237298,
                  4633735.5483757202
                ],
                [
                  296246.49018058,
                  4633736.0433234796
                ],
                [
                  296245.98840655101,
                  4633736.6151281102
                ],
                [
                  296255.22275999998,
                  4633743.6853569997
                ],
                [
                  296255.597541,
                  4633743.1887170002
                ],
                [
                  296256.07914799999,
                  4633743.5563789997
                ],
                [
                  296263.12577749701,
                  4633734.5836747698
                ],
                [
                  296262.76808364101,
                  4633734.2513170596
                ],
                [
                  296263.129860421,
                  4633733.6478746403
                ],
                [
                  296254.10845328798,
                  4633726.7204642296
                ],
                [
                  296253.72468434699,
                  4633727.1027121097
                ],
                [
                  296253.22531720903,
                  4633726.7096176799
                ]
              ]
            ]
          ],
          'footprint_altitude': [
            126.642,
            142.068
          ]
        };
      });

      describe('centerOfSite() function', function() {
        it('should return center of bounding box of footprint', function() {
          var result = SitesService.centerOfSite(site);

          var expected = [296254.559133486, 4633735.197487339, 134.35500000000002];
          expect(result).toEqual(expected);
        });
      });

      describe('getBoundingBox() function', function() {
        it('should return bounding box of footprint', function() {
          var result = SitesService.getBoundingBox(site);

          var expected = [296245.988406551, 4633726.70961768, 126.642, 296263.129860421, 4633743.685357, 142.068];
          expect(result).toEqual(expected);
        });
      });

      describe('getBoundingBoxSize() function', function() {
        it('should return size of bounding box of footprint', function() {
          var result = SitesService.getBoundingBoxSize(site);

          var expected = [8.570726934995037, 8.48786965990439, 7.713000000000008];
          expect(result).toEqual(expected);
        });
      });
    });

    describe('getById() function', function() {
      it('should return a site when id is present', function() {
        var result = SitesService.getById(162);

        expect(result).toEqual(site162json);
      });

      it('should return undefined when site with id is missing', function() {
        var result = SitesService.getById(9999999);

        expect(result).toBeUndefined();
      });
    });

    describe('selectSite() function', function() {
      it('should find only site 162', function() {
        SitesService.selectSite(site162json);

        var result = SitesService.searched;
        expect(result).toEqual([site162json]);
      });
    });
  });
});
