var HtmlReporter = require('protractor-html-screenshot-reporter');

exports.config = {
  allScriptsTimeout: 11000,

  specs: [
    '*.js'
  ],

  multiCapabilities: [{
    'browserName': 'chrome',
  }],

  baseUrl: 'http://localhost:9001/',

  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  },

  onPrepare: function() {
    // Add a screenshot reporter and store screenshots to `/tmp/screnshots`:
    jasmine.getEnv().addReporter(new HtmlReporter({
      baseDirectory: 'e2e/reports'
    }));
  }
};
