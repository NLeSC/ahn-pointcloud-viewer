PattyVis
========

[![Join the chat at https://gitter.im/NLeSC/ahn-pointcloud-viewer](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/NLeSC/ahn-pointcloud-viewer?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Build Status](https://travis-ci.org/NLeSC/ahn-pointcloud-viewer.svg)](https://travis-ci.org/NLeSC/ahn-pointcloud-viewer)

[![Code Climate](https://codeclimate.com/github/NLeSC/PattyVis/badges/gpa.svg)](https://codeclimate.com/github/NLeSC/ahn-pointcloud-viewer)
[![Test Coverage](https://codeclimate.com/github/NLeSC/PattyVis/badges/coverage.svg)](https://codeclimate.com/github/NLeSC/ahn-pointcloud-viewer)

Webgl pointcloud visualization of the Actuele Hoogtekaart Nederland (2) based on http://potree.org
--------------------------------------------------------------------------------------------------

Getting started (windows, from scratch)
---------------------------------------

1. Install Git : 	http://git-scm.com/downloads
2. Install Node.js : 	http://nodejs.org/ (Make sure add node to PATH option is checked)
  1. Create '$HOME/npm' folder (Where $HOME is c:\Users\<username>\AppData\Roaming).
  2. Open node command prompt and run `npm install -g bower grunt-cli`
3. Install Ruby: http://rubyinstaller.org/ (Make sure add ruby to PATH option is checked)
  1. Open ruby command prompt and run `gem install compass`
4. Start Git bash
5. Type: "git clone https://github.com/NLeSC/ahn-pointcloud-viewer"
6. Type: "cd ahn-pointcloud-viewer"
7. Type: "npm install -g grunt grunt-cli"
8. Type: "npm install"
8. Type: "bower install"
8. Type: "bower update"
9. Type: "grunt serve"
10. Open browser, go to "http://localhost:9000"

Getting started (Linux, Debian and Ubuntu based)
-------------------------------------------------

Prerequisites
------------

1. nodejs, http://nodejs.org/
2. bower, http://bower.io
3. compass, http://compass-style.org
4. Java Development Kit, https://www.java.com/

Installation
------------

### Install nodejs

Follow instructions at joyents github website:
https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager#debian-and-ubuntu-based-linux-distributions

### Install nodejs modules
Install bower and grunt-cli globally
```
sudo npm install -g bower grunt-cli
```

### Install compass

Compass is used to convert the sass 2 css.

1. Install Ruby using https://www.ruby-lang.org/en/documentation/installation/#apt
2. Install Ruby dev and other dependecy packages
```
sudo apt-get install ruby-dev libffi-dev
```
3. Install compass (for sass compilation)
```
gem install compass
```

### Fetch git repository
```
git clone https://github.com/NLeSC/ahn-pointcloud-viewer
```

### setup with bower
```
cd ahn-pointcloud-viewer
npm install
bower install
```
If you already have a installed the bower packages before, but need to update them for a new version of the code, run
```
bower update
```

### start development server & open browser
```
grunt serve
```
Changes made to code will automatically reload web page.

### Run unit tests

```
grunt test
```
Generates test report and coverage inside `test/reports` folder.

### Run end-to-end tests with local browser (chrome)

Tests in Chrome can be run with
```
grunt e2e-local
```

The pointcloud and minimap use a canvas and can't be tested automatically so they must be verified manually using the screenshots in the report.
Open `e2e/reports/report.html` in a web-browser.

### Run end-to-end tests on [sauce labs](https://saucelabs.com/)

To connnect to Sauce Labs use sauce connect program. [Here](https://docs.saucelabs.com/reference/sauce-connect/) you can find the details on how to install and run it.

Before tests can be run the sauce labs credentials must be setup

```
export SAUCE_USERNAME=<your sauce labs username>
export SAUCE_ACCESS_KEY=<your sauce labs access key>
```

Tests in Chrome, Firefox on Windows, Linux and OSX can be run with
```
grunt e2e-sauce
```

The pointcloud and minimap use a canvas and can't be tested automatically so they must be verified manually using the screencast in the report at `https://saucelabs.com/u/<your sauce labs username>`.

Travis-ci also runs end-to-end tests on sauce labs.

Note! Running `grunt e2e-sauce` will undo all changes in `app/` folder.

### Build a distro

```
grunt build
```
The `dist` folder has production ready distribution.

### Generate API documentation

```
grunt jsdoc
```

API documentation is generated in `doc/` directory.

Frame rate report
----------------

Use Chrome FPS plotting to get the frame rate.
1. Open developer tools
2. On Console tab goto Rendering tab (bottom screen)
3. Check the Show FPS meter checkbox
