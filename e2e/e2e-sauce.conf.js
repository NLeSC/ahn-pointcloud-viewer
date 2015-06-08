exports.config = {
  allScriptsTimeout: 21000,
  getPageTimeout: 20000,

  specs: [
    '*.js'
  ],

  sauceUser: process.env.SAUCE_USERNAME,
  sauceKey: process.env.SAUCE_ACCESS_KEY,
  sauceSeleniumAddress: 'localhost:4445/wd/hub',

  multiCapabilities: [{
    'browserName': 'chrome',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'name': 'Chrome Linux v41',
    'version': '41.0',
    'platform': 'Linux'
  }],

  baseUrl: 'http://localhost:9001/',

  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 60000
  }

};
