#!/usr/bin/python

import sys
import csv
import json

#test to make sure pyproj exists
try:
    import pyproj

except ImportError:
    sys.stderr.write("Please install the pyproj python module!\n")
    sys.exit(3)

try:
    from pymongo import MongoClient
except ImportError:
    sys.stderr.write("Please install the pymongo python module!\n")
    sys.exit(3)



isNAD83 = True
coordsList = []
outputFile = ""
latCol = 8
lonCol = 7
offenseCol = -1

if len(sys.argv) != 3:
    print 'Supply crimedata CSV and the year!'
    sys.exit(2)

csvFilename = sys.argv[1]
crimeYear = sys.argv[2]

if not crimeYear.isdigit():
    print 'Please supply a valid year!'
    sys.exit(2)

crimeYear = int(crimeYear)

client = MongoClient()
db = client.dc_crime
incidents = db.incidents

#set up the source and destination coordinate system
nad83=pyproj.Proj("+init=esri:102285") # Maryland State Plane for NAD 83
wgs84=pyproj.Proj("+init=EPSG:4326")   # WGS84 datum

with open(csvFilename, 'r') as csvFile:
    reader = csv.reader(csvFile, delimiter=',')

    curLine = 1
    wasSkipped = 0
    for row in reader:
        #we want to skip the first line
        if not wasSkipped:
            #check if it is LAT/LON data which seems
            #to be the format for data <= 2010
            if "LATITUDE" in row:
                isNAD83 = False
                #set the lat and lon columns
                latCol = row.index("LATITUDE")
                lonCol = row.index("LONGITUDE")

            offenseCol = row.index("OFFENSE")
            wasSkipped = 1
            continue

        if isNAD83:
            #data is in NAD83 coordinates
            #lets grab them an convert to WGS84

            try:
                curEastCoord = float(row[lonCol])
                curNorthCoord = float(row[latCol])
                #print curNorthCoord, curEastCoord
                curCoords = pyproj.transform(nad83, wgs84, curEastCoord, curNorthCoord)
            except ValueError:
                sys.stderr.write("\nCould not parse line number %d for %s. Continuing ...\n" % (curLine, csvFilename))
                continue
        else:
            #data is already in Lat/Lon so we are golden
            #just make sure to pull from the correct columns
            try:
                curCoords = [ float(row[lonCol]), float(row[latCol]) ]
            except ValueError:
                sys.stderr.write("\nCould not parse line number %d for %s. Continuing ...\n" % (curLine, csvFilename))
                continue

        #for now we are just dumping everything into arrays
        #coordsList.append({ "latitude" : curCoords[1], "longitude": curCoords[0]})
        coordsList.append([ round(curCoords[1], 6), round(curCoords[0], 6), row[offenseCol] ])
        curIncident = {
            "offense": row[offenseCol],
            "year": crimeYear,
            "lat": round(curCoords[1], 6),
            "lon": round(curCoords[0], 6)
        }
        incidents.insert_one(curIncident)
        curLine = curLine + 1

#print json.dumps(coordsList)
