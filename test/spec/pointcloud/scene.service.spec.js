'use strict';

describe('pointcloud.sceneService', function() {
  // load the module
  beforeEach(module('pattyApp.pointcloud'));

  var instance;
  var THREE;
  beforeEach(function() {
    inject(function(_THREE_, _SceneService_) {
      THREE = _THREE_;
      instance = _SceneService_;
    });
  });

  describe('construction', function() {
    it('should have a referenceFrame', function() {
      // TODO peform better compare
      expect(instance.referenceFrame).toBeDefined();
    });
  });

  describe('getScene() function', function() {
    it('should return a scene', function() {
      expect(instance.getScene()).toBeDefined();
    });
  });

  describe('projection conversions', function() {
    beforeEach(function() {
      instance.referenceFrame.position.set(295774.21909876, 4634313.3772155, 127.44568310513);
      instance.referenceFrame.updateMatrixWorld(true);
      instance.referenceFrame.applyMatrix(new THREE.Matrix4().set(
        1, 0, 0, 0,
        0, 0, 1, 0,
        0, -1, 0, 0,
        0, 0, 0, 1
      ));
      instance.referenceFrame.updateMatrixWorld(true);
    });

    describe('toLocal() function', function() {
      it('should convert geo position to threejs space', function() {
        var geoPos = new THREE.Vector3(296125.53171993, 4633868.9712901, 129.59767359683);

        var threePos = instance.toLocal(geoPos);

        var expected = new THREE.Vector3(591899.75046993, 257.043359938191, -9268182.4712901);
        expect(threePos).toEqual(expected);
      });
    });

    describe('toGeo() function', function() {
      it('should convert three position to geo space', function() {
        var threePos = new THREE.Vector3(591899.75046993, 257.043359938191, -9268182.4712901);

        var geoPos = instance.toGeo(threePos);

        var expected = new THREE.Vector3(296125.53171993, 4633868.9712901, 129.59767359580098);
        expect(geoPos).toEqual(expected);
      });

      it('should convert three boundary box to geo space', function() {
        var threePosMin = new THREE.Vector3(591899.75046993, 247.043359938191, -9268182.4712901);
        var threePosMax = new THREE.Vector3(593899.75046993, 257.043359938191, -9228182.4712901);
        var threePos = new THREE.Box3(threePosMin, threePosMax);

        var geoPos = instance.toGeo(threePos);

        var expectedMin = new THREE.Vector3(296125.53171993, 4633868.9712901, 119.59767359580101);
        var expectedMax = new THREE.Vector3(298125.53171993, 4593868.9712901, 129.59767359580985);
        var expected = new THREE.Box3(expectedMin, expectedMax);
        expect(geoPos).toEqual(expected);
      });
    });
  });
});
