AHN pointcloud viewer
=====================
![screenshot of ahn2 viewer showing willemstad](/doc/ahn2-screenshot.png "screenshot of ahn2 viewer showing willemstad")

[![Build Status](https://travis-ci.org/NLeSC/ahn-pointcloud-viewer.svg)](https://travis-ci.org/NLeSC/ahn-pointcloud-viewer)

[![Code Climate](https://codeclimate.com/github/NLeSC/ahn-pointcloud-viewer/badges/gpa.svg)](https://codeclimate.com/github/NLeSC/ahn-pointcloud-viewer)
[![Test Coverage](https://codeclimate.com/github/NLeSC/ahn-pointcloud-viewer/badges/coverage.svg)](https://codeclimate.com/github/NLeSC/ahn-pointcloud-viewer/coverage)

Webgl pointcloud visualization of the Actuele Hoogtekaart Nederland (2) based on http://potree.org
--------------------------------------------------------------------------------------------------

Related repositories
--------------------

- [Massive-PotreeConverter](https://github.com/NLeSC/Massive-PotreeConverter): Used to extend PotreeConverter to deal with massive point clouds like AHN2. This visualization requires the point cloud data to be converted to the potree format.
- [ahn-pointcloud-viewer-ws] (https://github.com/NLeSC/ahn-pointcloud-viewer-ws): Contains the web service in charge of the communication between this application and the database with meta-data regarding the point cloud data.


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

Getting started (Debian and Ubuntu based Linux distros)
-------------------------------------------------

Prerequisites
------------

1. [Node.js](http://nodejs.org/)
2. [Bower](http://bower.io)
3. [Compass](http://compass-style.org)
4. [Java Development Kit](https://www.java.com/)
5. Supported web browsers:
  * [Google Chrome](https://www.google.com/chrome/)
  * [Microsoft Edge](http://www.microsoft.com/en-us/windows/microsoft-edge)

Installation
------------

### Install Node.js

See the documentation [here](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions).

```
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Install Node.js modules

```
sudo npm install -g bower grunt-cli
```

### Install Compass

```
sudo apt-get install ruby-dev libffi-dev
sudo gem install compass
```

### Install AHN viewer

```
git clone https://github.com/NLeSC/ahn-pointcloud-viewer
cd ahn-pointcloud-viewer
npm install phantomjs
npm install
bower install
#bower update
```

### Test AHN viewer

```
grunt serve # opens http://localhost:9000 in your browser
```

### Run unit tests

```
grunt test
```

Note: This generates test & coverage reports (see the `test/reports` folder).

### Run end-to-end tests locally

```
grunt e2e-local
```

Note: Both the pointcloud and minimap use a canvas and can't be tested automatically so they must be verified manually using the screenshots in the report (open `e2e/reports/report.html` in your browser).

### Run end-to-end tests remotely on [Sauce Labs](https://saucelabs.com/)

To connect to Sauce Labs use sauce connect program. [Here](https://docs.saucelabs.com/reference/sauce-connect/) you can find the details on how to install and run it.

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

### Deploy to Github pages

Deploy distribution to `gh-pages` branch.
Make it available as http://nlesc.github.io/ahn-pointcloud-viewer

```
grunt build
grunt gh-pages
```
