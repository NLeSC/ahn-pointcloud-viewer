PattyVis
========

[![Build Status](https://travis-ci.org/NLeSC/PattyVis.svg?branch=master)](https://travis-ci.org/NLeSC/PattyVis)
[![Code Climate](https://codeclimate.com/github/NLeSC/PattyVis/badges/gpa.svg)](https://codeclimate.com/github/NLeSC/PattyVis)
[![Test Coverage](https://codeclimate.com/github/NLeSC/PattyVis/badges/coverage.svg)](https://codeclimate.com/github/NLeSC/PattyVis)
[![Sauce Test Status](https://saucelabs.com/buildstatus/patty-vis)](https://saucelabs.com/u/patty-vis)
[![devDependency Status](https://david-dm.org/NLeSC/PattyVis/dev-status.svg)](https://david-dm.org/NLeSC/PattyVis#info=devDependencies)
[![Codacy Badge](https://www.codacy.com/project/badge/a2ebd9977fe04aa1af6e5c47dc8d6927)](https://www.codacy.com/public/sverhoeven/PattyVis)

Webgl pointcloud visualization of the Via Appia based on http://potree.org
--------------------------------------------------------------------------
![logo](DOCS/pattyvis_fp_ss4.png "A beautiful vista")

A big step towards a 3D GIS Application.  
![logo](DOCS/pattyvis_fp_ss2.png "A big step towards a 3D GIS Application")
With 3D footprints of grave monuments based on GPS coordinates.  
![logo](DOCS/pattyvis_fp_ss1.png "With 3D footprints based on GPS coordinates")
A 'background' or reference frame was made with Fugro's drive-map technology http://www.drive-map.eu/  
![logo](DOCS/pattyvis_fp_ss9.png "The drive map visualized")
Several monuments have been photographed extensively and made into seperate pointclouds. This is an ongoing process.  
![logo](DOCS/pattyvis_fp_ss5.png "Here you can see the drive-map and the site-specific photography based pointcloud next to eachother")
![logo](DOCS/pattyvis_fp_ss3.png "A particularly well-captured monument.")
Measurements can be made in the 3D environment.  
![logo](DOCS/pattyvis_fp_ss8.png "Measurements can be made in the 3D environment.")
Historical maps can give extra information on the site's history.  
![logo](DOCS/pattyvis_fp_ss6.png "Historical maps can give extra information on the site's history.")
Searching options like the material used in the site can give extra insight.  
![logo](DOCS/pattyvis_fp_ss7.png "Historical maps can give extra information on the site's history.")


Getting started (windows, from scratch)
---------------------------------------

1. Install Git : 	http://git-scm.com/downloads
2. Install Node.js : 	http://nodejs.org/ (Make sure add node to PATH option is checked)
  1. Create '$HOME/npm' folder (Where $HOME is c:\Users\<username>\AppData\Roaming).
  2. Open node command prompt and run `npm install -g bower grunt-cli`
3. Install Ruby: http://rubyinstaller.org/ (Make sure add ruby to PATH option is checked)
  1. Open ruby command prompt and run `gem install compass`
4. Start Git bash
5. Type: "git clone https://github.com/NLeSC/PattyVis"
6. Type: "cd PattyVis"
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
git clone https://github.com/NLeSC/PattyVis
```

### setup with bower
```
cd PattyVis
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

Mockup
------

For mockup see https://wiki.esciencecenter.nl/index.php/Patty_Visualization

Oculus Rift
-----------
Get the host application and run it: https://github.com/Instrument/oculus-bridge

Creation of sites.json
----------------------

In db run:

    SELECT site_id, ST_ASGEOJSON(geom, 15,5) FROM sites_geoms WHERE site_id IN (162,13);

To get geometry, bbox and crs.

Height and properties need to be filled manually.

Frame rate report
----------------

Use Chrome FPS plotting to get the frame rate.
1. Open developer tools
2. On Console tab goto Rendering tab (bottom screen)
3. Check the Show FPS meter checkbox
