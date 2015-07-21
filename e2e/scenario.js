'use strict';

/* global describe, beforeEach, it, expect */
/* global element, by, browser */

describe('pattyApp', function() {

  beforeEach(function() {
    browser.get('index.html');
  });

  it('should have a title', function() {
    expect(browser.getTitle()).toMatch('AHN2 pointcloud viewer');
  });

  describe('initial state', function() {
    it('should have zero search results', function() {
      expect(element.all(by.css('.search-result')).count()).toBe(0);
    });
    it('should not show settings panel', function() {
      var panel = element(by.css('.settings-panel'));
      expect(panel.isDisplayed()).toBeFalsy();
    });

    it('should not show tools', function() {
      var panel = element(by.css('.toolbox-tools'));
      expect(panel.isDisplayed()).toBeFalsy();
    });

    it('should hide the clear button', function() {
      var results = element(by.css('patty-search-panel .glyphicon-remove'));
      expect(results.isDisplayed()).toBeFalsy();
    });

  });

  describe('searched on "roosendaal"', function() {
    beforeEach(function() {
      element(by.model('sp.query')).sendKeys('roosendaal');
    });

    it('should show the clear button', function() {
      var results = element(by.css('patty-search-panel .glyphicon-remove'));
      expect(results.isDisplayed()).toBeTruthy();
    });
  });

  describe('click on extract icon', function() {
    beforeEach(function() {
      element(by.css('.icon-big.extract-icon')).click();
    });

    it('should show extract panel', function() {
      var panel = element(by.css('.extract-panel'));
      expect(panel.isDisplayed()).toBeTruthy();
    });
  });

  describe('click on settings gear', function() {
    beforeEach(function() {
      element(by.css('.icon-big.gear-icon')).click();
    });

    it('should show settings panel', function() {
      var panel = element(by.css('.settings-panel'));
      expect(panel.isDisplayed()).toBeTruthy();
    });
  });

  describe('click on help icon', function() {
    beforeEach(function() {
      element(by.css('.icon-big.help-icon')).click();
    });

    it('should show help panel', function() {
      var panel = element(by.css('.help-panel'));
      expect(panel.isDisplayed()).toBeTruthy();
    });
  });

  describe('clicking on toolbox icon', function() {
    beforeEach(function() {
      element(by.css('.icon-big.toolbox-icon')).click();
    });

    it('should show tools', function() {
      var panel = element(by.css('.toolbox-tools'));
      expect(panel.isDisplayed()).toBeTruthy();
    });

    describe('and then clicking on bottom toolbox icon', function() {

      beforeEach(function() {
        element(by.css('.icon-big.toolbox-icon')).click();
        // wait for toolbox to close, otherwise it will still be displayed partly
        browser.sleep(200);
      });

      it('should hide tools', function() {
        var panel = element(by.css('.toolbox-tools'));
        expect(panel.isDisplayed()).toBeFalsy();
      });
    });

    describe('and then clicking on top toolbox icon', function() {

      beforeEach(function() {
        // wait for toolbox to open, otherwise icon is moving when click is attempted
        browser.sleep(500);
        element(by.css('.icon-big.toolbox-tray-top-icon')).click();
        // wait for toolbox to close, otherwise it will still be displayed partly
        browser.sleep(200);
      });

      it('should hide tools', function() {
        var panel = element(by.css('.toolbox-tools'));
        expect(panel.isDisplayed()).toBeFalsy();
      });
    });
  });

});
