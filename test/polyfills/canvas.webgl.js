/**
 * In Potree during include (<script src="potree.js">) a canvas is created to determine each features.
 *
 * During testing with headless or webgl-less browser the tests can't run.
 */
(function() {
  'use strict';

  var ftCanvas = document.createElement('canvas');
  if (ftCanvas.getContext('webgl') || ftCanvas.getContext('experimental-webgl')) {
    // no need to fill
  } else {
    document.createElementOrig = document.createElement;
    document.createElement = function(tagName) {
      if (tagName === 'canvas') {
        return {
          getContext: function(context) {
            if (context === 'webgl') {
              return {
                getShaderPrecisionFormat: function() {
                  return {precision: 4};
                },
                getExtension: function() {
                  return false;
                },
                getParameter: function() {
                  return false;
                },
                VERTEX_SHADER: 1,
                LOW_FLOAT: 1,
                HIGH_FLOAT: 3,
                MEDIUM_FLOAT: 2,
                MAX_VARYING_VECTORS: 1
              };
            }
            return document.createElementOrig(tagName).getContext(context);
          }
        };
      }
      return document.createElementOrig(tagName);
    };
  }

})();
