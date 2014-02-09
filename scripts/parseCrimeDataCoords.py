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

isNAD83 = True
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
            #check if it is LAT/LON data which seems
            #to be the format for data <= 2010
            if row[8] == "LATITUDE": 
                isNAD83 = False

            wasSkipped = 1
            continue

        if isNAD83:
            #data is in NAD83 coordinates
            #lets grab them an convert to WGS84
            curEastCoord = float(row[7])
            curNorthCoord = float(row[8])
            #print curNorthCoord, curEastCoord
            curCoords = pyproj.transform(nad83, wgs84, curEastCoord, curNorthCoord)
        else:
            #data is already in Lat/Lon so we are golden
            #just make sure to pull from the correct columns
            curCoords = [ float(row[9]), float(row[8]) ]

        #for now we are just dumping everything into arrays
        #coordsList.append({ "latitude" : curCoords[1], "longitude": curCoords[0]})
        coordsList.append([ round(curCoords[1], 2), round(curCoords[0], 2)])

print json.dumps(coordsList)
