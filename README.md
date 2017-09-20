AHN2 point cloud viewer
=====================

[![Build Status](https://travis-ci.org/NLeSC/ahn-pointcloud-viewer.svg)](https://travis-ci.org/NLeSC/ahn-pointcloud-viewer)

[![Code Climate](https://codeclimate.com/github/NLeSC/ahn-pointcloud-viewer/badges/gpa.svg)](https://codeclimate.com/github/NLeSC/ahn-pointcloud-viewer)
[![Test Coverage](https://codeclimate.com/github/NLeSC/ahn-pointcloud-viewer/badges/coverage.svg)](https://codeclimate.com/github/NLeSC/ahn-pointcloud-viewer/coverage)

[Potree](http://potree.org/)-based point cloud visualization of the current digital elevation model of the Netherlands ([Actueel Hoogtebestand Nederland (2)](http://www.ahn.nl/). For further details, please refer to the original publication by [Rubi _et al._ (2016)](http://resolver.tudelft.nl/uuid:0472e0d1-ec75-465a-840e-fd53d427c177).

![Willemstad in the AHN2 viewer](/doc/ahn2-screenshot.png "screenshot of ahn2 viewer showing willemstad")

Related repositories
--------------------

- [Massive-PotreeConverter](https://github.com/NLeSC/Massive-PotreeConverter) extends the [PotreeConverter](https://github.com/potree/PotreeConverter) to handle massive point cloud data such as AHN2.
- [ahn-pointcloud-viewer-ws](https://github.com/NLeSC/ahn-pointcloud-viewer-ws): Contains the web service in charge of the communication between this application and the database with meta-data regarding the point cloud data.


Prerequisites
-------------

* Point cloud data in the _potree_ format.
* [Node.js](http://nodejs.org/)
* [Bower](http://bower.io)
* [Compass](http://compass-style.org)
* [Java Development Kit](https://www.java.com/)
* Supported web browsers:
  * [Google Chrome](https://www.google.com/chrome/)
  * [Microsoft Edge](http://www.microsoft.com/en-us/windows/microsoft-edge)

Installation: Windows
---------------------

### Install [Git CLI/GUI clients](http://git-scm.com/downloads)

### Install [Node.js](http://nodejs.org/) and required modules

* Make sure the _Add node to PATH_ option is checked.
* Create '$HOME/npm' folder (where $HOME is C:\Users\<username>\AppData\Roaming).

`npm install -g bower grunt-cli`

### Install [Ruby](http://rubyinstaller.org/) and required package

* Make sure the _Add Ruby to PATH_ option is checked

`gem install compass`

### Install AHN2 viewer

```
git clone https://github.com/NLeSC/ahn-pointcloud-viewer
cd ahn-pointcloud-viewer
npm install -g grunt grunt-cli
npm install
bower install
bower update
```

8. Test AHN2 viewer

```
grunt serve # starts the web server and opens http://localhost:9000 in your browser
```


Installation: Debian/Ubuntu-based Linux distros
-----------------------------------------------

### Install Node.js and required modules

See the documentation [here](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions).

```
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g bower grunt-cli
```

### Install Ruby and required package

```
sudo apt-get install ruby-dev libffi-dev
sudo gem install compass
```

### Install AHN2 viewer

```
git clone https://github.com/NLeSC/ahn-pointcloud-viewer
cd ahn-pointcloud-viewer
npm install phantomjs
npm install
bower install
#bower update
```

### Test AHN2 viewer

```
grunt serve # starts the web server and opens http://localhost:9000 in your browser
```

### Run unit tests

```
grunt test
```

Note: This generates test and coverage reports (see the `test/reports` folder).

### Run end-to-end tests locally

```
grunt e2e-local
```

Note: Both the point cloud and minimap use a canvas and can't be tested automatically so they must be verified manually using the screenshots in the report (open `e2e/reports/report.html` in your browser).

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

The point cloud and minimap use a canvas and can't be tested automatically so they must be verified manually using the screencast in the report at `https://saucelabs.com/u/<your sauce labs username>`.

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
