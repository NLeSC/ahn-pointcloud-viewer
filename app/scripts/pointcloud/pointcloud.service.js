/* global requestAnimationFrame:false */
(function() {
  'use strict';

  function PointcloudService(THREE, Potree, $window, $rootScope,
    DrivemapService,
    CameraService, SceneService,
    PathControls, MeasuringService, EarthcontrolsService,
    RailService, ExtractionDrawingService, PointcloudExtractionSelectionService,
    cfpLoadingBar, Messagebus) {

    Potree.Gradients.VIRIDIS = [
  		[0,new THREE.Color(0.267,0.0049,0.3294)],
      [0.0039,new THREE.Color(0.2685,0.0096,0.3354)],
      [0.0078,new THREE.Color(0.2699,0.0146,0.3414)],
      [0.0118,new THREE.Color(0.2713,0.0199,0.3473)],
      [0.0157,new THREE.Color(0.2726,0.0256,0.3531)],
      [0.0196,new THREE.Color(0.2738,0.0315,0.3589)],
      [0.0235,new THREE.Color(0.275,0.0378,0.3645)],
      [0.0275,new THREE.Color(0.276,0.0442,0.3702)],
      [0.0314,new THREE.Color(0.277,0.0503,0.3757)],
      [0.0353,new THREE.Color(0.2779,0.0563,0.3812)],
      [0.0392,new THREE.Color(0.2788,0.0621,0.3866)],
      [0.0431,new THREE.Color(0.2796,0.0678,0.3919)],
      [0.0471,new THREE.Color(0.2803,0.0734,0.3972)],
      [0.051,new THREE.Color(0.2809,0.0789,0.4023)],
      [0.0549,new THREE.Color(0.2814,0.0843,0.4074)],
      [0.0588,new THREE.Color(0.2819,0.0897,0.4124)],
      [0.0627,new THREE.Color(0.2823,0.095,0.4173)],
      [0.0667,new THREE.Color(0.2827,0.1002,0.4222)],
      [0.0706,new THREE.Color(0.2829,0.1054,0.4269)],
      [0.0745,new THREE.Color(0.2831,0.1106,0.4316)],
      [0.0784,new THREE.Color(0.2832,0.1157,0.4361)],
      [0.0824,new THREE.Color(0.2832,0.1208,0.4406)],
      [0.0863,new THREE.Color(0.2832,0.1258,0.445)],
      [0.0902,new THREE.Color(0.2831,0.1309,0.4492)],
      [0.0941,new THREE.Color(0.2829,0.1359,0.4534)],
      [0.098,new THREE.Color(0.2826,0.1409,0.4575)],
      [0.102,new THREE.Color(0.2823,0.1459,0.4615)],
      [0.1059,new THREE.Color(0.2819,0.1509,0.4654)],
      [0.1098,new THREE.Color(0.2814,0.1558,0.4692)],
      [0.1137,new THREE.Color(0.2809,0.1608,0.4729)],
      [0.1176,new THREE.Color(0.2803,0.1657,0.4765)],
      [0.1216,new THREE.Color(0.2796,0.1706,0.48)],
      [0.1255,new THREE.Color(0.2788,0.1755,0.4834)],
      [0.1294,new THREE.Color(0.278,0.1804,0.4867)],
      [0.1333,new THREE.Color(0.2771,0.1852,0.4899)],
      [0.1373,new THREE.Color(0.2762,0.1901,0.493)],
      [0.1412,new THREE.Color(0.2752,0.1949,0.496)],
      [0.1451,new THREE.Color(0.2741,0.1997,0.4989)],
      [0.149,new THREE.Color(0.273,0.2045,0.5017)],
      [0.1529,new THREE.Color(0.2718,0.2093,0.5044)],
      [0.1569,new THREE.Color(0.2706,0.2141,0.5071)],
      [0.1608,new THREE.Color(0.2693,0.2188,0.5096)],
      [0.1647,new THREE.Color(0.268,0.2235,0.512)],
      [0.1686,new THREE.Color(0.2666,0.2283,0.5143)],
      [0.1725,new THREE.Color(0.2651,0.233,0.5166)],
      [0.1765,new THREE.Color(0.2637,0.2376,0.5188)],
      [0.1804,new THREE.Color(0.2621,0.2423,0.5208)],
      [0.1843,new THREE.Color(0.2606,0.2469,0.5228)],
      [0.1882,new THREE.Color(0.259,0.2515,0.5247)],
      [0.1922,new THREE.Color(0.2573,0.2561,0.5266)],
      [0.1961,new THREE.Color(0.2556,0.2607,0.5283)],
      [0.2,new THREE.Color(0.2539,0.2653,0.53)],
      [0.2039,new THREE.Color(0.2522,0.2698,0.5316)],
      [0.2078,new THREE.Color(0.2504,0.2743,0.5331)],
      [0.2118,new THREE.Color(0.2486,0.2788,0.5346)],
      [0.2157,new THREE.Color(0.2468,0.2832,0.5359)],
      [0.2196,new THREE.Color(0.245,0.2877,0.5373)],
      [0.2235,new THREE.Color(0.2431,0.2921,0.5385)],
      [0.2275,new THREE.Color(0.2412,0.2965,0.5397)],
      [0.2314,new THREE.Color(0.2393,0.3009,0.5408)],
      [0.2353,new THREE.Color(0.2374,0.3052,0.5419)],
      [0.2392,new THREE.Color(0.2355,0.3095,0.5429)],
      [0.2431,new THREE.Color(0.2336,0.3138,0.5439)],
      [0.2471,new THREE.Color(0.2317,0.3181,0.5448)],
      [0.251,new THREE.Color(0.2297,0.3224,0.5457)],
      [0.2549,new THREE.Color(0.2278,0.3266,0.5465)],
      [0.2588,new THREE.Color(0.2259,0.3308,0.5473)],
      [0.2627,new THREE.Color(0.2239,0.335,0.5481)],
      [0.2667,new THREE.Color(0.222,0.3392,0.5488)],
      [0.2706,new THREE.Color(0.2201,0.3433,0.5494)],
      [0.2745,new THREE.Color(0.2181,0.3474,0.55)],
      [0.2784,new THREE.Color(0.2162,0.3515,0.5506)],
      [0.2824,new THREE.Color(0.2143,0.3556,0.5512)],
      [0.2863,new THREE.Color(0.2124,0.3597,0.5517)],
      [0.2902,new THREE.Color(0.2105,0.3637,0.5522)],
      [0.2941,new THREE.Color(0.2086,0.3678,0.5527)],
      [0.298,new THREE.Color(0.2068,0.3718,0.5531)],
      [0.302,new THREE.Color(0.2049,0.3757,0.5535)],
      [0.3059,new THREE.Color(0.2031,0.3797,0.5539)],
      [0.3098,new THREE.Color(0.2012,0.3837,0.5543)],
      [0.3137,new THREE.Color(0.1994,0.3876,0.5546)],
      [0.3176,new THREE.Color(0.1976,0.3915,0.555)],
      [0.3216,new THREE.Color(0.1959,0.3954,0.5553)],
      [0.3255,new THREE.Color(0.1941,0.3993,0.5556)],
      [0.3294,new THREE.Color(0.1924,0.4032,0.5558)],
      [0.3333,new THREE.Color(0.1906,0.4071,0.5561)],
      [0.3373,new THREE.Color(0.1889,0.4109,0.5563)],
      [0.3412,new THREE.Color(0.1872,0.4147,0.5565)],
      [0.3451,new THREE.Color(0.1856,0.4186,0.5568)],
      [0.349,new THREE.Color(0.1839,0.4224,0.5569)],
      [0.3529,new THREE.Color(0.1823,0.4262,0.5571)],
      [0.3569,new THREE.Color(0.1806,0.43,0.5573)],
      [0.3608,new THREE.Color(0.179,0.4338,0.5574)],
      [0.3647,new THREE.Color(0.1774,0.4375,0.5576)],
      [0.3686,new THREE.Color(0.1758,0.4413,0.5577)],
      [0.3725,new THREE.Color(0.1743,0.445,0.5578)],
      [0.3765,new THREE.Color(0.1727,0.4488,0.5579)],
      [0.3804,new THREE.Color(0.1712,0.4525,0.558)],
      [0.3843,new THREE.Color(0.1696,0.4563,0.558)],
      [0.3882,new THREE.Color(0.1681,0.46,0.5581)],
      [0.3922,new THREE.Color(0.1666,0.4637,0.5581)],
      [0.3961,new THREE.Color(0.1651,0.4674,0.5581)],
      [0.4,new THREE.Color(0.1636,0.4711,0.5581)],
      [0.4039,new THREE.Color(0.1621,0.4748,0.5581)],
      [0.4078,new THREE.Color(0.1607,0.4785,0.5581)],
      [0.4118,new THREE.Color(0.1592,0.4822,0.5581)],
      [0.4157,new THREE.Color(0.1577,0.4859,0.558)],
      [0.4196,new THREE.Color(0.1563,0.4896,0.5579)],
      [0.4235,new THREE.Color(0.1548,0.4933,0.5578)],
      [0.4275,new THREE.Color(0.1534,0.497,0.5577)],
      [0.4314,new THREE.Color(0.1519,0.5007,0.5576)],
      [0.4353,new THREE.Color(0.1505,0.5044,0.5574)],
      [0.4392,new THREE.Color(0.149,0.5081,0.5573)],
      [0.4431,new THREE.Color(0.1476,0.5117,0.557)],
      [0.4471,new THREE.Color(0.1462,0.5154,0.5568)],
      [0.451,new THREE.Color(0.1448,0.5191,0.5566)],
      [0.4549,new THREE.Color(0.1433,0.5228,0.5563)],
      [0.4588,new THREE.Color(0.1419,0.5265,0.556)],
      [0.4627,new THREE.Color(0.1405,0.5301,0.5557)],
      [0.4667,new THREE.Color(0.1391,0.5338,0.5553)],
      [0.4706,new THREE.Color(0.1378,0.5375,0.5549)],
      [0.4745,new THREE.Color(0.1364,0.5412,0.5545)],
      [0.4784,new THREE.Color(0.1351,0.5449,0.554)],
      [0.4824,new THREE.Color(0.1337,0.5485,0.5535)],
      [0.4863,new THREE.Color(0.1324,0.5522,0.553)],
      [0.4902,new THREE.Color(0.1312,0.5559,0.5525)],
      [0.4941,new THREE.Color(0.1299,0.5596,0.5519)],
      [0.498,new THREE.Color(0.1287,0.5633,0.5512)],
      [0.502,new THREE.Color(0.1276,0.5669,0.5506)],
      [0.5059,new THREE.Color(0.1265,0.5706,0.5498)],
      [0.5098,new THREE.Color(0.1254,0.5743,0.5491)],
      [0.5137,new THREE.Color(0.1244,0.578,0.5483)],
      [0.5176,new THREE.Color(0.1235,0.5817,0.5474)],
      [0.5216,new THREE.Color(0.1226,0.5854,0.5466)],
      [0.5255,new THREE.Color(0.1218,0.5891,0.5456)],
      [0.5294,new THREE.Color(0.1211,0.5927,0.5446)],
      [0.5333,new THREE.Color(0.1206,0.5964,0.5436)],
      [0.5373,new THREE.Color(0.1201,0.6001,0.5425)],
      [0.5412,new THREE.Color(0.1197,0.6038,0.5414)],
      [0.5451,new THREE.Color(0.1195,0.6075,0.5402)],
      [0.549,new THREE.Color(0.1194,0.6111,0.539)],
      [0.5529,new THREE.Color(0.1195,0.6148,0.5377)],
      [0.5569,new THREE.Color(0.1197,0.6185,0.5363)],
      [0.5608,new THREE.Color(0.1201,0.6222,0.5349)],
      [0.5647,new THREE.Color(0.1206,0.6258,0.5335)],
      [0.5686,new THREE.Color(0.1214,0.6295,0.532)],
      [0.5725,new THREE.Color(0.1223,0.6332,0.5304)],
      [0.5765,new THREE.Color(0.1234,0.6368,0.5288)],
      [0.5804,new THREE.Color(0.1248,0.6405,0.5271)],
      [0.5843,new THREE.Color(0.1263,0.6441,0.5253)],
      [0.5882,new THREE.Color(0.1281,0.6477,0.5235)],
      [0.5922,new THREE.Color(0.1301,0.6514,0.5216)],
      [0.5961,new THREE.Color(0.1323,0.655,0.5197)],
      [0.6,new THREE.Color(0.1347,0.6586,0.5176)],
      [0.6039,new THREE.Color(0.1373,0.6623,0.5156)],
      [0.6078,new THREE.Color(0.1402,0.6659,0.5134)],
      [0.6118,new THREE.Color(0.1433,0.6695,0.5112)],
      [0.6157,new THREE.Color(0.1466,0.673,0.5089)],
      [0.6196,new THREE.Color(0.1501,0.6766,0.5066)],
      [0.6235,new THREE.Color(0.1539,0.6802,0.5042)],
      [0.6275,new THREE.Color(0.1579,0.6838,0.5017)],
      [0.6314,new THREE.Color(0.162,0.6873,0.4991)],
      [0.6353,new THREE.Color(0.1664,0.6909,0.4965)],
      [0.6392,new THREE.Color(0.1709,0.6944,0.4938)],
      [0.6431,new THREE.Color(0.1757,0.6979,0.491)],
      [0.6471,new THREE.Color(0.1807,0.7014,0.4882)],
      [0.651,new THREE.Color(0.1858,0.7049,0.4853)],
      [0.6549,new THREE.Color(0.1911,0.7084,0.4823)],
      [0.6588,new THREE.Color(0.1966,0.7118,0.4792)],
      [0.6627,new THREE.Color(0.2022,0.7153,0.4761)],
      [0.6667,new THREE.Color(0.208,0.7187,0.4729)],
      [0.6706,new THREE.Color(0.214,0.7221,0.4696)],
      [0.6745,new THREE.Color(0.2201,0.7255,0.4662)],
      [0.6784,new THREE.Color(0.2264,0.7289,0.4628)],
      [0.6824,new THREE.Color(0.2328,0.7322,0.4593)],
      [0.6863,new THREE.Color(0.2394,0.7356,0.4557)],
      [0.6902,new THREE.Color(0.2461,0.7389,0.452)],
      [0.6941,new THREE.Color(0.2529,0.7422,0.4483)],
      [0.698,new THREE.Color(0.2599,0.7455,0.4445)],
      [0.702,new THREE.Color(0.2669,0.7488,0.4406)],
      [0.7059,new THREE.Color(0.2741,0.752,0.4366)],
      [0.7098,new THREE.Color(0.2815,0.7552,0.4326)],
      [0.7137,new THREE.Color(0.2889,0.7584,0.4284)],
      [0.7176,new THREE.Color(0.2965,0.7616,0.4242)],
      [0.7216,new THREE.Color(0.3041,0.7647,0.4199)],
      [0.7255,new THREE.Color(0.3119,0.7678,0.4156)],
      [0.7294,new THREE.Color(0.3198,0.7709,0.4112)],
      [0.7333,new THREE.Color(0.3278,0.774,0.4066)],
      [0.7373,new THREE.Color(0.3359,0.777,0.402)],
      [0.7412,new THREE.Color(0.3441,0.78,0.3974)],
      [0.7451,new THREE.Color(0.3524,0.783,0.3926)],
      [0.749,new THREE.Color(0.3607,0.786,0.3878)],
      [0.7529,new THREE.Color(0.3692,0.7889,0.3829)],
      [0.7569,new THREE.Color(0.3778,0.7918,0.3779)],
      [0.7608,new THREE.Color(0.3864,0.7946,0.3729)],
      [0.7647,new THREE.Color(0.3952,0.7975,0.3678)],
      [0.7686,new THREE.Color(0.404,0.8003,0.3626)],
      [0.7725,new THREE.Color(0.4129,0.803,0.3573)],
      [0.7765,new THREE.Color(0.4219,0.8058,0.3519)],
      [0.7804,new THREE.Color(0.431,0.8085,0.3465)],
      [0.7843,new THREE.Color(0.4401,0.8111,0.341)],
      [0.7882,new THREE.Color(0.4494,0.8138,0.3354)],
      [0.7922,new THREE.Color(0.4587,0.8164,0.3297)],
      [0.7961,new THREE.Color(0.4681,0.8189,0.324)],
      [0.8,new THREE.Color(0.4775,0.8214,0.3182)],
      [0.8039,new THREE.Color(0.487,0.8239,0.3123)],
      [0.8078,new THREE.Color(0.4966,0.8264,0.3064)],
      [0.8118,new THREE.Color(0.5063,0.8288,0.3004)],
      [0.8157,new THREE.Color(0.516,0.8312,0.2943)],
      [0.8196,new THREE.Color(0.5258,0.8335,0.2881)],
      [0.8235,new THREE.Color(0.5356,0.8358,0.2819)],
      [0.8275,new THREE.Color(0.5455,0.838,0.2756)],
      [0.8314,new THREE.Color(0.5555,0.8403,0.2693)],
      [0.8353,new THREE.Color(0.5655,0.8424,0.2629)],
      [0.8392,new THREE.Color(0.5756,0.8446,0.2564)],
      [0.8431,new THREE.Color(0.5857,0.8467,0.2499)],
      [0.8471,new THREE.Color(0.5958,0.8487,0.2433)],
      [0.851,new THREE.Color(0.606,0.8507,0.2367)],
      [0.8549,new THREE.Color(0.6163,0.8527,0.2301)],
      [0.8588,new THREE.Color(0.6266,0.8546,0.2234)],
      [0.8627,new THREE.Color(0.6369,0.8565,0.2166)],
      [0.8667,new THREE.Color(0.6473,0.8584,0.2099)],
      [0.8706,new THREE.Color(0.6576,0.8602,0.2031)],
      [0.8745,new THREE.Color(0.6681,0.862,0.1963)],
      [0.8784,new THREE.Color(0.6785,0.8637,0.1895)],
      [0.8824,new THREE.Color(0.6889,0.8654,0.1827)],
      [0.8863,new THREE.Color(0.6994,0.8671,0.176)],
      [0.8902,new THREE.Color(0.7099,0.8688,0.1693)],
      [0.8941,new THREE.Color(0.7204,0.8704,0.1626)],
      [0.898,new THREE.Color(0.7309,0.8719,0.156)],
      [0.902,new THREE.Color(0.7414,0.8734,0.1496)],
      [0.9059,new THREE.Color(0.7519,0.875,0.1432)],
      [0.9098,new THREE.Color(0.7624,0.8764,0.1371)],
      [0.9137,new THREE.Color(0.7729,0.8779,0.1311)],
      [0.9176,new THREE.Color(0.7833,0.8793,0.1254)],
      [0.9216,new THREE.Color(0.7938,0.8807,0.12)],
      [0.9255,new THREE.Color(0.8042,0.882,0.115)],
      [0.9294,new THREE.Color(0.8146,0.8834,0.1103)],
      [0.9333,new THREE.Color(0.8249,0.8847,0.1062)],
      [0.9373,new THREE.Color(0.8353,0.886,0.1026)],
      [0.9412,new THREE.Color(0.8456,0.8873,0.0997)],
      [0.9451,new THREE.Color(0.8558,0.8886,0.0975)],
      [0.949,new THREE.Color(0.866,0.8899,0.096)],
      [0.9529,new THREE.Color(0.8762,0.8911,0.0953)],
      [0.9569,new THREE.Color(0.8863,0.8924,0.0954)],
      [0.9608,new THREE.Color(0.8963,0.8936,0.0963)],
      [0.9647,new THREE.Color(0.9063,0.8949,0.0981)],
      [0.9686,new THREE.Color(0.9162,0.8961,0.1007)],
      [0.9725,new THREE.Color(0.9261,0.8973,0.1041)],
      [0.9765,new THREE.Color(0.9359,0.8986,0.1081)],
      [0.9804,new THREE.Color(0.9456,0.8998,0.1128)],
      [0.9843,new THREE.Color(0.9553,0.9011,0.1181)],
      [0.9882,new THREE.Color(0.9649,0.9023,0.1239)],
      [0.9922,new THREE.Color(0.9744,0.9036,0.1302)],
      [0.9961,new THREE.Color(0.9839,0.9049,0.1369)],
      [1,new THREE.Color(0.9932,0.9062,0.1439)]
    ];

    var QUALITIES = { Splats:'Splats', Low:'Circle'};

    var me = this;

    this.elRenderArea = null;

    me.settings = {
      pointCountTarget: 2.5,
      pointSize: 2.00,
      opacity: 1,
      showSkybox: false,
      interpolate: false,
      showStats: false,
      highQuality: false,
      showBoundingBox: false,

      pointColorTypes: Potree.PointColorType,
      clipModes: Potree.ClipMode,
      pointSizeType: Potree.PointSizeType.FIXED,
      pointColorType: Potree.PointColorType.HEIGHT,
      pointShape: Potree.PointShape.SQUARE,
      clipMode: Potree.ClipMode.HIGHLIGHT_INSIDE,
      quality: QUALITIES.Low,
      qualities: QUALITIES,

      useDEMCollisions: false,
      minNodeSize: 100,
      heightMin: -5,
      heightMax: 45,
      useEDL: false
    };

    me.predefinedSettings = {
      'LOW': {
      pointCountTarget: 2.5,
      pointSize: 2.00,
      opacity: 1,
      showSkybox: false,
      interpolate: false,
      showStats: false,
      highQuality: false,
      showBoundingBox: false,

      pointColorTypes: Potree.PointColorType,
      clipModes: Potree.ClipMode,
      pointSizeType: Potree.PointSizeType.FIXED,
      pointColorType: Potree.PointColorType.HEIGHT,
      pointShape: Potree.PointShape.SQUARE,
      clipMode: Potree.ClipMode.HIGHLIGHT_INSIDE,
      quality: QUALITIES.Low,

      useDEMCollisions: false,
      minNodeSize: 100,
      heightMin: -5,
      heightMax: 45,
      useEDL: false
    },
      'STANDARD': {
      pointCountTarget: 5.0,
      pointSize: 1.00,
      opacity: 1,
      showSkybox: true,
      interpolate: false,
      showStats: false,
      highQuality: false,
      showBoundingBox: false,

      pointColorTypes: Potree.PointColorType,
      clipModes: Potree.ClipMode,
      pointSizeType: Potree.PointSizeType.ATTENUATED,
      pointColorType: Potree.PointColorType.HEIGHT,
      pointShape: Potree.PointShape.CIRCLE,
      clipMode: Potree.ClipMode.HIGHLIGHT_INSIDE,
      quality: QUALITIES.Low,

      useDEMCollisions: false,
      minNodeSize: 100,
      heightMin: -5,
      heightMax: 45,
      useEDL: false
    },
    'HIGH': {
      pointCountTarget: 5,
      pointSize: 1.00,
      opacity: 1,
      showSkybox: true,
      interpolate: true,
      showStats: false,
      highQuality: true,
      showBoundingBox: false,

      pointColorTypes: Potree.PointColorType,
      clipModes: Potree.ClipMode,
      pointSizeType: Potree.PointSizeType.ATTENUATED,
      pointColorType: Potree.PointColorType.HEIGHT,
      pointShape: Potree.PointShape.CIRCLE,
      clipMode: Potree.ClipMode.HIGHLIGHT_INSIDE,
      quality: QUALITIES.Splats,

      useDEMCollisions: false,
      minNodeSize: 100,
      heightMin: -5,
      heightMax: 45,
      useEDL: false
    },
    'ULTRA': {
      pointCountTarget: 10,
      pointSize: 0.5,
      opacity: 1,
      showSkybox: true,
      interpolate: true,
      showStats: false,
      highQuality: false,
      showBoundingBox: false,

      pointColorTypes: Potree.PointColorType,
      clipModes: Potree.ClipMode,
      pointSizeType: Potree.PointSizeType.ATTENUATED,
      pointColorType: Potree.PointColorType.HEIGHT,
      pointShape: Potree.PointShape.CIRCLE,
      clipMode: Potree.ClipMode.HIGHLIGHT_INSIDE,
      quality: QUALITIES.Splats,

      useDEMCollisions: false,
      minNodeSize: 100,
      heightMin: -5,
      heightMax: 45,
      useEDL: true
    }};

    me.settings=me.predefinedSettings.STANDARD;

    me.stats = {
      nrPoints: 0,
      nrNodes: 0,
      sceneCoordinates: {
        x: 0,
        y: 0,
        z: 0
      },
      lasCoordinates: {
        x: 0,
        y: 0,
        z: 0,
        crs: 'unknown'
      }
    };

    me.renderer = null;
    var camera;
    var scene;
    var pointcloud;

    var skybox;

    me.pathMesh = null;

    var referenceFrame = SceneService.referenceFrame;
    var mouse = {
      x: 0,
      y: 0
    };

    this.orbitControls = null;
    this.isInOrbitMode = false;

    var directionalLight;

    var drivemapMaterial = new Potree.PointCloudMaterial();
    drivemapMaterial.gradient = Potree.Gradients.VIRIDIS;

    // function loadSkybox(path) {
    //   var camera = new THREE.PerspectiveCamera(75, $window.innerWidth / $window.innerHeight, 1, 100000);
    //   cameraBG = new THREE.Camera();
    //   var scene = new THREE.Scene();
    //
    //   var format = '.jpg';
    //   var urls = [
    //     path + 'px' + format, path + 'nx' + format,
    //     path + 'py' + format, path + 'ny' + format,
    //     path + 'pz' + format, path + 'nz' + format
    //   ];
    //
    //   var textureCube = THREE.ImageUtils.loadTextureCube(urls, new THREE.CubeRefractionMapping());
    //
    //   var shader = THREE.ShaderLib.cube;
    //   shader.uniforms.tCube.value = textureCube;
    //
    //   var material = new THREE.ShaderMaterial({
    //     fragmentShader: shader.fragmentShader,
    //     vertexShader: shader.vertexShader,
    //     uniforms: shader.uniforms,
    //     depthWrite: false,
    //     side: THREE.BackSide
    //   }),
    //
    //   mesh = new THREE.Mesh(new THREE.BoxGeometry(100000, 100000, 100000), material);
    //   scene.add(mesh);
    //
    //   return {
    //     'camera': camera,
    //     'scene': scene
    //   };
    // }

    function getMousePointCloudIntersection() {
      var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
      vector.unproject(camera);
      var direction = vector.sub(camera.position).normalize();
      var ray = new THREE.Ray(camera.position, direction);

      var pointClouds = [];
      scene.traverse(function(object) {
        if (object instanceof Potree.PointCloudOctree) {
          pointClouds.push(object);
        }
      });

      var closestPoint = null;
      var closestPointDistance = null;

      for (var i = 0; i < pointClouds.length; i++) {
        var pointcloud = pointClouds[i];
        var point = pointcloud.pick(me.renderer, camera, ray, {
          accuracy: 0.5
        });

        if (!point) {
          continue;
        }

        var distance = camera.position.distanceTo(point.position);

        if (!closestPoint || distance < closestPointDistance) {
          closestPoint = point;
          closestPointDistance = distance;
        }
      }

      return closestPoint ? closestPoint.position : null;
    }

    function updateStats() {
      if (me.settings.showStats) {
        if (pointcloud) {
          me.stats.nrPoints = pointcloud.numVisiblePoints;
          me.stats.nrNodes = pointcloud.numVisibleNodes;
        } else {
          me.stats.nrPoints = 'none';
          me.stats.nrNodes = 'none';
        }

        var I = getMousePointCloudIntersection();
        if (I) {
          var sceneCoordinates = I;
          me.stats.sceneCoordinates.x = sceneCoordinates.x.toFixed(2);
          me.stats.sceneCoordinates.y = sceneCoordinates.y.toFixed(2);
          me.stats.sceneCoordinates.z = sceneCoordinates.z.toFixed(2);
          var geoCoordinates = SceneService.toGeo(sceneCoordinates);
          me.stats.lasCoordinates.x = geoCoordinates.x.toFixed(2);
          me.stats.lasCoordinates.y = geoCoordinates.y.toFixed(2);
          me.stats.lasCoordinates.z = geoCoordinates.z.toFixed(2);
        }

        // stats are changed in requestAnimationFrame loop,
        // which is outside the AngularJS $digest loop
        // to have changes to stats propagated to angular, we need to trigger a digest
        $rootScope.$digest();
      }
    }

    function onMouseMove(event) {
      mouse.x = (event.clientX / me.renderer.domElement.clientWidth) * 2 - 1;
      mouse.y = -(event.clientY / me.renderer.domElement.clientHeight) * 2 + 1;
    }

    this.initThree = function() {
      var width = $window.innerWidth;
      var height = $window.innerHeight;

      scene = SceneService.getScene();
      camera = CameraService.camera;

      me.renderer = new THREE.WebGLRenderer({premultipliedAlpha: false});
      me.renderer.setSize(width, height);
      me.renderer.autoClear = false;
	    me.elRenderArea.appendChild(me.renderer.domElement);
      me.renderer.domElement.addEventListener('mousemove', onMouseMove, false);

    	directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    	directionalLight.position.set( 10, 10, 10 );
    	directionalLight.lookAt( new THREE.Vector3(0, 0, 0));
    	scene.add( directionalLight );

    	var light = new THREE.AmbientLight( 0x555555 ); // soft white light
    	scene.add( light );

      MeasuringService.init(me.renderer, scene, camera);

      PointcloudExtractionSelectionService.init(me.renderer, scene, camera);
      ExtractionDrawingService.init(me.renderer, scene, camera);

      skybox = Potree.utils.loadSkybox('images/skybox/');

      // enable frag_depth extension for the interpolation shader, if available
      me.renderer.context.getExtension('EXT_frag_depth');

      DrivemapService.ready.then(this.loadPointcloud);
    };

    this.loadPointcloud = function() {
      // load pointcloud
      var pointcloudPath = DrivemapService.getPointcloudUrl();
      me.stats.lasCoordinates.crs = DrivemapService.getCrs();

      Potree.POCLoader.load(pointcloudPath, function(geometry) {
        pointcloud = new Potree.PointCloudOctree(geometry, drivemapMaterial);

        pointcloud.material.pointSizeType = Potree.PointSizeType.ADAPTIVE;
        pointcloud.material.size = me.settings.pointSize;
        pointcloud.visiblePointsTarget = me.settings.pointCountTarget * 1000 * 1000;

        referenceFrame.add(pointcloud);
        referenceFrame.updateMatrixWorld(true); // doesn't seem to do anything
        // reference frame position to pointcloud position:
        referenceFrame.position.set(-pointcloud.position.x, -pointcloud.position.y, 0);
        // rotates to some unknown orientation:
        referenceFrame.updateMatrixWorld(true);
        // rotates point cloud to align with horizon
        referenceFrame.applyMatrix(new THREE.Matrix4().set(
          1, 0, 0, 0,
          0, 0, 1, 0,
          0, -1, 0, 0,
          0, 0, 0, 1
        ));
        referenceFrame.updateMatrixWorld(true);

        RailService.setCameraAndLookAtWaypoints(
          DrivemapService.getCameraPath(),
          DrivemapService.getLookPath()
        );

        //var miny = 306740, maxy = 615440, minx = 13420, maxx = 322120;
        // var minx = 79692.68, maxx = 96258.93, miny = 383917.51, maxy = 422503.12;
        // var worldHeight = 256, worldWidth = 256;

        // var leftTop = SceneService.toLocal(new THREE.Vector3(minx, maxy, 0));
        // var rightBottom = SceneService.toLocal(new THREE.Vector3(maxx, miny, 0));

        // var diffx = rightBottom.x - leftTop.x;
        // var diffy = rightBottom.z - leftTop.z;

        //var planeGeometry = new THREE.PlaneBufferGeometry( diffx, diffy, worldWidth - 1, worldHeight - 1 );
        //planeGeometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
        //planeGeometry.applyMatrix( new THREE.Matrix4().makeTranslation( leftTop.x+(diffx/2), -50, rightBottom.z-(diffy/2)) );
				//var planeMesh = new THREE.Mesh( planeGeometry, new THREE.MeshBasicMaterial( { color: 0xffff00 } ) );
        //SceneService.addMaximap(planeMesh);
        //scene.add( planeMesh );

        var viewerSurrogate = {
          renderer: me.renderer,
          scene: me.scene
        }
        
        me.earthControls = new Potree.EarthControls(viewerSurrogate);
        me.earthControls.enabled = true;
        // me.earthControls.addEventListener("start", me.disableAnnotations.bind(this));
        // me.earthControls.addEventListener("end", me.enableAnnotations.bind(this));


        // PathControls.init(me.elRenderArea);

        MeasuringService.setPointcloud(pointcloud);

        // EarthcontrolsService.init(camera, me.renderer, scene, scene, pointcloud, me.elRenderArea);

        Messagebus.publish('legendTexture change', Potree.Gradients.VIRIDIS);
      });
    };

    this.disableDrivemap = function() {
      referenceFrame.remove(pointcloud);
    };

    this.enableDrivemap = function() {
      referenceFrame.add(pointcloud);
    };

    var intensityMax = null;
    var heightMin = null;
    var heightMax = null;
    var emptyVector = new THREE.Vector3();
    var updateCounter = 0;


    this.update = function() {
      Potree.pointLoadLimit =  me.settings.pointCountTarget * 2 * 1000 * 1000;

      if (me.settings.useEDL) {
        directionalLight.position.copy(camera.position);
        directionalLight.lookAt(emptyVector.set(0,0,0).addVectors(camera.position, camera.getWorldDirection()));
      }

      if (pointcloud) {
      //   var bbWorld = Potree.utils.computeTransformedBoundingBox(pointcloud.boundingBox, pointcloud.matrixWorld);
      //
      //   if (!intensityMax) {
      //     var root = pointcloud.pcoGeometry.root;
      //     if (root !== null && root.loaded) {
      //       var attributes = pointcloud.pcoGeometry.root.geometry.attributes;
      //       if (attributes.intensity) {
      //         var array = attributes.intensity.array;
      //         var max = 0;
      //         for (var i = 0; i < array.length; i++) {
      //           max = Math.max(array[i]);
      //         }
      //
      //         if (max <= 1) {
      //           intensityMax = 1;
      //         } else if (max <= 256) {
      //           intensityMax = 255;
      //         } else {
      //           intensityMax = max;
      //         }
      //       }
      //     }
      //   }
      //   if (heightMin === null) {
      //     heightMin = bbWorld.min.y;
      //     heightMax = bbWorld.max.y;
      //   }


        pointcloud.material.clipMode = me.settings.clipMode;
        pointcloud.material.heightMin = me.settings.heightMin;
        pointcloud.material.heightMax = me.settings.heightMax;
        pointcloud.material.intensityMin = 0;
        pointcloud.material.intensityMax = 65000;
        pointcloud.showBoundingBox = me.settings.showBoundingBox;
		    pointcloud.generateDEM = me.settings.useDEMCollisions;
		    pointcloud.minimumNodePixelSize = me.settings.minNodeSize;



        // pointcloud.material.size = me.settings.pointSize;
        // pointcloud.visiblePointsTarget = me.settings.pointCountTarget * 1000 * 1000;
        // pointcloud.material.opacity = me.settings.opacity;
        // pointcloud.material.pointSizeType = me.settings.pointSizeType;
        // pointcloud.material.pointColorType = me.settings.pointColorType;
        // pointcloud.material.pointShape = me.settings.pointShape;
        // pointcloud.material.interpolate = me.settings.interpolate;
        // pointcloud.material.minSize = 2;
        //pointcloud.material.weighted = true;

        pointcloud.update(camera, me.renderer);


        // update progress bar
        // updateCounter++;
        // if (updateCounter > 100) {
        //   var progress = pointcloud.visibleNodes.length / pointcloud.visibleGeometry.length;
        //   var prevProgress = cfpLoadingBar.status();
        //   if (progress === 1 && prevProgress < 1){
        //     cfpLoadingBar.complete();
        //   } else if (progress < 1 && progress !== prevProgress){
        //     cfpLoadingBar.start();
        //     cfpLoadingBar.set(progress);
        //   } else if (progress === Infinity && prevProgress < 1) {
        //     cfpLoadingBar.complete();
        //   }
        //   updateCounter = 0;
        // }
      } else {
        // loading metadata
        cfpLoadingBar.start();
      }

      // if (me.isInOrbitMode) {
      //   me.orbitControls.update();
      // } else {
      // }

      MeasuringService.update();

      CameraService.update();

      if (pointcloud) {
        if (EarthcontrolsService.enabled ) {
          EarthcontrolsService.update();
        } else {
          PathControls.updateInput();
        }
      }

      // SceneService.update();

      updateStats();
    };

    var PotreeRenderer = function() {
      var resize = function(width, height) {
        var aspect = width / height;

        camera.aspect = aspect;
        camera.updateProjectionMatrix();

        me.renderer.setSize(width, height);
      };

      this.render = function() {
        resize(me.elRenderArea.clientWidth, me.elRenderArea.clientHeight);

        // render skybox
        if (me.settings.showSkybox) {
          skybox.camera.rotation.copy(camera.rotation);
          me.renderer.render(skybox.scene, skybox.camera);
        // } else {
        //   me.renderer.render(sceneBG, cameraBG);
        }

        if (pointcloud) {
          if (pointcloud.originalMaterial) {
            pointcloud.material = pointcloud.originalMaterial;
          }

          // var bbWorld = Potree.utils.computeTransformedBoundingBox(pointcloud.boundingBox, pointcloud.matrixWorld);

          pointcloud.visiblePointsTarget = me.settings.pointCountTarget * 1000 * 1000;
          pointcloud.material.size = me.settings.pointSize;
          pointcloud.material.opacity = me.settings.opacity;
          pointcloud.material.pointColorType = me.settings.pointColorType;
          pointcloud.material.pointSizeType = me.settings.pointSizeType;
          pointcloud.material.pointShape = me.settings.PointShape;
          pointcloud.material.interpolate = me.settings.interpolate;
          pointcloud.material.weighted = false;
          pointcloud.material.gradient = Potree.Gradients.VIRIDIS;
        }

        // render scene
        me.renderer.render(scene, camera);
        // me.renderer.render(scenePointCloud, camera);

        // MeasuringService.tools.heightprofile.render();
        // MeasuringService.tools.volume.render();
        me.renderer.clearDepth();
        MeasuringService.tools.measuring.render();
        // MeasuringService.tools.transformation.render();
      };
    };
    var potreeRenderer = new PotreeRenderer();

    // high quality rendering using splats
    var highQualityRenderer = null;
    var HighQualityRenderer = function() {

      var depthMaterial = null;
      var attributeMaterial = null;
      var normalizationMaterial = null;

      var rtDepth;
      var rtNormalize;

      var initHQSPlats = function() {
        if (depthMaterial !== null) {
          return;
        }

        depthMaterial = new Potree.PointCloudMaterial();
        attributeMaterial = new Potree.PointCloudMaterial();

        depthMaterial.pointColorType = Potree.PointColorType.DEPTH;
        depthMaterial.pointShape = Potree.PointShape.CIRCLE;
        depthMaterial.interpolate = false;
        depthMaterial.weighted = false;
        depthMaterial.minSize = 2;

        attributeMaterial.pointShape = Potree.PointShape.CIRCLE;
        attributeMaterial.gradient = Potree.Gradients.VIRIDIS;
        attributeMaterial.interpolate = false;
        attributeMaterial.weighted = true;
        attributeMaterial.minSize = 2;

        rtDepth = new THREE.WebGLRenderTarget(1024, 1024, {
          minFilter: THREE.NearestFilter,
          magFilter: THREE.NearestFilter,
          format: THREE.RGBAFormat,
          type: THREE.FloatType
        });

        rtNormalize = new THREE.WebGLRenderTarget(1024, 1024, {
          minFilter: THREE.LinearFilter,
          magFilter: THREE.NearestFilter,
          format: THREE.RGBAFormat,
          type: THREE.FloatType
        });

        var uniformsNormalize = {
          depthMap: {
            type: 't',
            value: rtDepth
          },
          texture: {
            type: 't',
            value: rtNormalize
          }
        };

        normalizationMaterial = new THREE.ShaderMaterial({
          uniforms: uniformsNormalize,
          vertexShader: Potree.Shaders['normalize.vs'],
          fragmentShader: Potree.Shaders['normalize.fs']
        });
      };

      var resize = function(width, height) {
        if (rtDepth.width === width && rtDepth.height === height) {
          return;
        }

        rtDepth.dispose();
        rtNormalize.dispose();

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        me.renderer.setSize(width, height);
        rtDepth.setSize(width, height);
        rtNormalize.setSize(width, height);
      };

      // render with splats
      this.render = function(renderer) {

        var width = me.elRenderArea.clientWidth;
        var height = me.elRenderArea.clientHeight;

        initHQSPlats();

        resize(width, height);


        renderer.clear();
        if (me.settings.showSkybox) {
          skybox.camera.rotation.copy(camera.rotation);
          renderer.render(skybox.scene, skybox.camera);
        // } else {
        //   renderer.render(sceneBG, cameraBG);
        }
        renderer.render(scene, camera);

        if (pointcloud) {

          depthMaterial.uniforms.octreeSize.value = pointcloud.pcoGeometry.boundingBox.size().x;
          attributeMaterial.uniforms.octreeSize.value = pointcloud.pcoGeometry.boundingBox.size().x;

          pointcloud.visiblePointsTarget = me.settings.pointCountTarget * 1000 * 1000;
          var originalMaterial = pointcloud.material;

          { // DEPTH PASS
            depthMaterial.size = me.settings.pointSize;
            depthMaterial.pointSizeType = me.settings.pointSizeType;
            depthMaterial.screenWidth = width;
            depthMaterial.screenHeight = height;
            depthMaterial.uniforms.visibleNodes.value = pointcloud.material.visibleNodesTexture;
            depthMaterial.uniforms.octreeSize.value = pointcloud.pcoGeometry.boundingBox.size().x;
            depthMaterial.fov = camera.fov * (Math.PI / 180);
            depthMaterial.spacing = pointcloud.pcoGeometry.spacing;
            depthMaterial.near = camera.near;
            depthMaterial.far = camera.far;
            depthMaterial.heightMin = me.settings.heightMin;
            depthMaterial.heightMax = me.settings.heightMax;
            depthMaterial.uniforms.visibleNodes.value = pointcloud.material.visibleNodesTexture;
            depthMaterial.uniforms.octreeSize.value = pointcloud.pcoGeometry.boundingBox.size().x;
            depthMaterial.bbSize = pointcloud.material.bbSize;
            depthMaterial.treeType = pointcloud.material.treeType;

            scene.overrideMaterial = depthMaterial;
            renderer.clearTarget(rtDepth, true, true, true);
            renderer.render(scene, camera, rtDepth);
            scene.overrideMaterial = null;
          }

          { // ATTRIBUTE PASS
            attributeMaterial.size = me.settings.pointSize;
            attributeMaterial.pointSizeType = me.settings.pointSizeType;
            attributeMaterial.screenWidth = width;
            attributeMaterial.screenHeight = height;
            attributeMaterial.pointColorType = me.settings.pointColorType;
            attributeMaterial.depthMap = rtDepth;
            attributeMaterial.uniforms.visibleNodes.value = pointcloud.material.visibleNodesTexture;
            attributeMaterial.uniforms.octreeSize.value = pointcloud.pcoGeometry.boundingBox.size().x;
            attributeMaterial.fov = camera.fov * (Math.PI / 180);
            attributeMaterial.spacing = pointcloud.pcoGeometry.spacing;
            attributeMaterial.near = camera.near;
            attributeMaterial.far = camera.far;
            attributeMaterial.heightMin = me.settings.heightMin;
            attributeMaterial.heightMax = me.settings.heightMax;
            attributeMaterial.intensityMin = pointcloud.material.intensityMin;
            attributeMaterial.intensityMax = pointcloud.material.intensityMax;
            attributeMaterial.setClipBoxes(pointcloud.material.clipBoxes);
            attributeMaterial.clipMode = pointcloud.material.clipMode;
            attributeMaterial.bbSize = pointcloud.material.bbSize;
            attributeMaterial.treeType = pointcloud.material.treeType;

            scene.overrideMaterial = attributeMaterial;
            renderer.clearTarget(rtNormalize, true, true, true);
            renderer.render(scene, camera, rtNormalize);
            scene.overrideMaterial = null;
          }

          { // NORMALIZATION PASS
            normalizationMaterial.uniforms.depthMap.value = rtDepth;
            normalizationMaterial.uniforms.texture.value = rtNormalize;
            Potree.utils.screenPass.render(renderer, normalizationMaterial);
          }

          pointcloud.material = originalMaterial;

          MeasuringService.tools.volume.render();
          me.renderer.clearDepth();
          MeasuringService.tools.heightprofile.render();
          MeasuringService.tools.measuring.render();
          MeasuringService.tools.transformation.render();
        }


      };
    };



    var edlRenderer = null;
    var EDLRenderer = function() {

      var edlMaterial = null;
      var attributeMaterial = null;

      //var depthTexture = null;

      var rtColor = null;
      // var gl = me.renderer.context;

      var initEDL = function() {
        if (edlMaterial !== null) {
          return;
        }

        //var depthTextureExt = gl.getExtension("WEBGL_depth_texture");

        edlMaterial = new Potree.EyeDomeLightingMaterial();
        attributeMaterial = new Potree.PointCloudMaterial();
        attributeMaterial.gradient = Potree.Gradients.VIRIDIS;

        attributeMaterial.pointShape = Potree.PointShape.CIRCLE;
        attributeMaterial.interpolate = false;
        attributeMaterial.weighted = false;
        // attributeMaterial.minSize = 2;
        attributeMaterial.useLogarithmicDepthBuffer = false;
        attributeMaterial.useEDL = true;

        rtColor = new THREE.WebGLRenderTarget(1024, 1024, {
          minFilter: THREE.LinearFilter,
          magFilter: THREE.NearestFilter,
          format: THREE.RGBAFormat,
          type: THREE.FloatType,
          //type: THREE.UnsignedByteType,
          //depthBuffer: false,
          //stencilBuffer: false
        });

        //depthTexture = new THREE.Texture();
        //depthTexture.__webglInit = true;
        //depthTexture.__webglTexture = gl.createTexture();;
        //gl.bindTexture(gl.TEXTURE_2D, depthTexture.__webglTexture);
        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        //gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT, 1024, 1024, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_SHORT, null);
      };

      var resize = function() {
        var width = me.elRenderArea.clientWidth;
        var height = me.elRenderArea.clientHeight;
        var aspect = width / height;

        var needsResize = (rtColor.width !== width || rtColor.height !== height);

        // disposal will be unnecessary once this fix made it into three.js master:
        // https://github.com/mrdoob/three.js/pull/6355
        if (needsResize) {
          rtColor.dispose();
        }

        camera.aspect = aspect;
        camera.updateProjectionMatrix();

        me.renderer.setSize(width, height);
        rtColor.setSize(width, height);

        //if(needsResize){
        //	renderer.setRenderTarget(rtColor);
        //	var framebuffer = rtColor.__webglFramebuffer;
        //	gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        //
        //
        //	gl.bindRenderbuffer( gl.RENDERBUFFER, rtColor.__webglRenderbuffer );
        //	gl.renderbufferStorage( gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, rtColor.width, rtColor.height );
        //	gl.framebufferRenderbuffer( gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, null );
        //
        //	gl.bindTexture(gl.TEXTURE_2D, depthTexture.__webglTexture);
        //	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        //	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        //	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        //	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        //	gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT, width, height, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT, null);
        //
        //	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, depthTexture.__webglTexture, 0);
        //
        //	renderer.setRenderTarget(null);
        //}
      };

      this.render = function() {
        initEDL();

        resize();

        me.renderer.clear();
        if (me.settings.showSkybox) {
          skybox.camera.rotation.copy(camera.rotation);
          me.renderer.render(skybox.scene, skybox.camera);
        // } else {
        //   me.renderer.render(sceneBG, cameraBG);
        }
        me.renderer.render(scene, camera);

        if (pointcloud) {
          var width = me.elRenderArea.clientWidth;
          var height = me.elRenderArea.clientHeight;

          var octreeSize = pointcloud.pcoGeometry.boundingBox.size().x;

          pointcloud.visiblePointsTarget = me.settings.pointCountTarget * 1000 * 1000;
          // var originalMaterial = pointcloud.material;

          { // COLOR & DEPTH PASS
            attributeMaterial.size = me.settings.pointSize;
            attributeMaterial.pointSizeType = me.settings.pointSizeType;
            attributeMaterial.screenWidth = width;
            attributeMaterial.screenHeight = height;
            attributeMaterial.pointColorType = me.settings.pointColorType;
            attributeMaterial.uniforms.visibleNodes.value = pointcloud.material.visibleNodesTexture;
            attributeMaterial.uniforms.octreeSize.value = octreeSize;
            attributeMaterial.fov = camera.fov * (Math.PI / 180);
            attributeMaterial.spacing = pointcloud.pcoGeometry.spacing;
            attributeMaterial.near = camera.near;
            attributeMaterial.far = camera.far;
            attributeMaterial.heightMin = me.settings.heightMin;
            attributeMaterial.heightMax = me.settings.heightMax;
            attributeMaterial.intensityMin = pointcloud.material.intensityMin;
            attributeMaterial.intensityMax = pointcloud.material.intensityMax;
            attributeMaterial.setClipBoxes(pointcloud.material.clipBoxes);
            attributeMaterial.clipMode = pointcloud.material.clipMode;
            attributeMaterial.bbSize = pointcloud.material.bbSize;
            attributeMaterial.treeType = pointcloud.material.treeType;

            scene.overrideMaterial = attributeMaterial;
            me.renderer.clearTarget(rtColor, true, true, true);
            me.renderer.render(scene, camera, rtColor);
            scene.overrideMaterial = null;
          }

          { // EDL OCCLUSION PASS
            edlMaterial.uniforms.screenWidth.value = width;
            edlMaterial.uniforms.screenHeight.value = height;
            edlMaterial.uniforms.near.value = camera.near;
            edlMaterial.uniforms.far.value = camera.far;
            edlMaterial.uniforms.colorMap.value = rtColor;
            edlMaterial.uniforms.expScale.value = camera.far;

            //edlMaterial.uniforms.depthMap.value = depthTexture;

            Potree.utils.screenPass.render(me.renderer, edlMaterial);
          }

          me.renderer.render(scene, camera);

          MeasuringService.tools.heightprofile.render();
          MeasuringService.tools.volume.render();
          me.renderer.clearDepth();
          MeasuringService.tools.measuring.render();
          MeasuringService.tools.transformation.render();
        }


      };
    };

    this.loop = function() {
      requestAnimationFrame(me.loop);

      me.update();

			// if(me.settings.highQuality) {
      //   me.renderHighQuality();
			// }else{
			// 	me.render();
			// }

      if (me.settings.useEDL) {
        if (!edlRenderer) {
          edlRenderer = new EDLRenderer();
        }
        edlRenderer.render(me.renderer);
      } else if (me.settings.quality === 'Splats') {
        if (!highQualityRenderer) {
          highQualityRenderer = new HighQualityRenderer();
        }
        highQualityRenderer.render(me.renderer);
      } else {
        potreeRenderer.render();
      }
    };

    this.attachCanvas = function(el) {
      me.elRenderArea = el;
      me.initThree();
      var canvas = me.renderer.domElement;
      el.appendChild(canvas);
      me.loop();
    };
  }

  angular.module('pattyApp.pointcloud')
    .service('PointcloudService', PointcloudService);
})();
