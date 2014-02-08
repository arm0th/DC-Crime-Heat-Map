#!/bin/bash
CURL=`which curl`
UNZIP=`which unzip`
DATA_PATH=../data
PYTHON=`which python`
PYTHON_PARSER=parseCrimeDataCoords.py
JS_PATH=../html/js
JS_PREFIX=crimeDataCoords

#URLS
crimeDataURL2011=http://data.octo.dc.gov/feeds/crime_incidents/archive/crime_incidents_2011_CSV.zip
crimeDataURL2012=http://data.octo.dc.gov/feeds/crime_incidents/archive/crime_incidents_2012_CSV.zip
crimeDataURL2013=http://data.octo.dc.gov/feeds/crime_incidents/archive/crime_incidents_2013_CSV.zip

function checkPath {
    pathBinary=$1

    if [ -z $pathBinary ]; then
        echo "$pathBinary was not found in path! Exiting ..."
        exit -1
    fi
}

function downloadData {
    url=$1
    year=$2
    dataPath="${DATA_PATH}/crimeDataDC_${year}.zip"

    if [ ! -e "$dataPath" ]; then
        #use curl to pull down all of the crime data
        echo "Retrieving ${year} data ..."
        $CURL -o "$dataPath" "$url"
        echo "Extracting ${year} data ..."
        $UNZIP "$dataPath" -d "$DATA_PATH"
    fi
}

function processData {
    for csv in ${DATA_PATH}/*.csv; do 
        curYear=`echo $csv|sed 's/[^0-9]//g'`;
        echo -n "Converting CSV to json file for $curYear data ... "
        $PYTHON $PYTHON_PARSER $csv > "${JS_PATH}/${JS_PREFIX}_${curYear}.json"
        echo "done"
    done
}

#check to make sure we have all the command line tools that we need
checkPath $CURL
checkPath $UNZIP
checkPath $PYTHON

#create data path if it already doesn't exist
if [ ! -e $DATA_PATH ]; then
    mkdir "$DATA_PATH"
fi

#reteive and extract data
downloadData $crimeDataURL2011 2011
downloadData $crimeDataURL2012 2012
downloadData $crimeDataURL2013 2013

#process all of the downloaded data
processData
