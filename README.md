DC Crime Heat Map
=================

DC Crime Heat Map is a web appliction that uses MapBox web tiles and Leaflet to display a heatmap of all crime incidents in Washington, DC. The original dataset is available to the public provided by the Disttrict of Columbia's [data website](http://data.dc.gov/).

## Dependencies
The front-end portion of the app uses [MapBox's](http://www.mapbox.com) JavaScript library for the base tile layers. The [leaflet.heat](http:/??) Leaflet heatmap plugin is used as well as the [Cluster Layer](http://)  plugin. All front-end dependencies are managed by bower so the following is needed:
* nodejs
* bower (must be installed globally)

To download and generate the data, the following is needed:

* bash (if on Windows, install cygwin)
* curl
* python
* [pyproj](https://github.com/jswhit/pyproj/archive/v1.9.4rel.zip) (version 1.9.4) python module
* [pymongo](http://docs.mongodb.org/ecosystem/drivers/python/) python module

## Installation

First be sure that you have pyproj installed.

On apt-get based Linux systems you should be able to install with something like the following:

```bash
$ sudo apt-get install python-pyproj
```

If you're on a Mac or your Linux distribution did not package the module, [download](https://code.google.com/p/pyproj/downloads/list) it and execute the following:

```bash
$ tar zxvf pyproj-1.9.3.tar.gz
$ cd pyproj-1.9.3
$ python setup.py build
$ sudo python setup.py install
```

After pyproj is installed, clone this repository and run bower

```bash
$ bower install
```

## Mongo installation

The python script also needs to connect to mongodb using pymongo. Install it on a Mac using easy_install. See the mongodb [docs](http://api.mongodb.org/python/current/installation.html?_ga=1.183557222.1199728032.1418370087) for installation 

```
sudo easy_install pymongo
```

Next run the download script

```bash
$ cd scripts
$ ./getCrimeData.sh
```

The download script retrieves the data, uncompresses and then uses a python script to parse the data, convert the coordinates and output json files into the html/js/data folder.

## Unit Tests

The [Mocha](http://mochajs.org/) test framework is used for unit tests in addition to [Chai](http://chaijs.com/) for the assertions. To run the test suite, enter the following command:

```bash
$ npm test
```

## Server side

MongoDB runs when running grunt serve. Currently working on offloading static files to mocha
