#!/usr/bin/python

import sys
import csv
import json

#test to make sure pyproj exists
try:
    import pyproj

except ImportError:
    print "Please install the pyproj python module!"
    sys.exit(3)

coordsList = []
outputFile = ""

if len(sys.argv) != 2:
    print 'Supply crimedata CSV!'
    sys.exit(2)

csvFilename = sys.argv[1]

#set up the source and destination coordinate system
nad83=pyproj.Proj("+init=esri:102285") # Maryland State Plane for NAD 83
wgs84=pyproj.Proj("+init=EPSG:4326")   # WGS84 datum

with open(csvFilename, 'r') as csvFile:
    reader = csv.reader(csvFile, delimiter=',')

    wasSkipped = 0
    for row in reader:
        #we want to skip the first line
        if not wasSkipped:
            wasSkipped = 1
            continue

        curEastCoord = row[7]
        curNorthCoord = row[8]
        #print curNorthCoord, curEastCoord
        curCoords = pyproj.transform(nad83, wgs84, curEastCoord, curNorthCoord)

        coordsList.append({ "latitude" : curCoords[1], "longitude": curCoords[0]})

print json.dumps(coordsList)
