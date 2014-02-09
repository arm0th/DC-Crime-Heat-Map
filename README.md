DC Crime Heat Map
=================

DC Crime Heat Map is a web appliction that uses MapBox web tiles and Leaflet to display a heatmap of all crime incidents in Washington, DC. The original dataset is available to the public provided by the Disttrict of Columbia's [data website](http://data.dc.gov/).

## Dependencies
The HTML portion of the app uses [MapBox's](http://www.mapbox.com) JavaScript library and also makes use of the Leaflet HeatMap plugin. 

The download and generate the data, the following is needed:

* bash (if on Windows, install cygwin)
* unzip
* curl
* python
* [pyproj](https://code.google.com/p/pyproj/downloads/list) (version 1.9.3) python module

## Installation

First be sure that you have pyproj installed. 

On apt-get based Linux systems you should be able to install with something like the following:

```bash
sudo apt-get install python-pyproj
```

If you're on a Mac or your Linux distribution did not package the module, [download](https://code.google.com/p/pyproj/downloads/list) it and execute the following:

```bash
$ tar zxvf pyproj-1.9.3.tar.gz
$ cd pyproj-1.9.3
$ python setup.py build
$ sudo python setup.py install
```

After pyproj ins installed, clone this repository and run the download script

```bash
$ cd scripts
$ ./getCrimeData.sh
```

The download script retrieves the data, uncompresses and then uses a python script to parse the data, convert the coordinates and output json files into the html/js folder.
