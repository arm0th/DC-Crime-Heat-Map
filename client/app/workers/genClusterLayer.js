/*global onmessage, self, setTimeout, clearTimeout, postMessage */
var curStartIdx = 0,
    chunkOffset = 1500,
    data = [],
    dataLen = 0,
    timeoutVal = 300, //milliseconds
    timeoutObj;

function processChunk() {
    "use strict";

    var dataSlice, nextStartIdx;

    if (self.curStartIdx >= (self.dataLen - 1)) {
        //we've reached the end of the dataset, send the complete message
        postMessage({
            status: "complete"
        });

        //stop interval and terminate worker
        clearTimeout(self.timeoutObj);
        self.close();
    } else if ((self.dataLen - self.curStartIdx) < self.chunkOffset) {
        dataSlice = self.data.slice(self.curStartIdx);
        postMessage({
            status: "loading",
            data: dataSlice
        });
        self.curStartIdx = self.dataLen - 1;

        //run the last chunk
        self.timeoutObj = setTimeout(processChunk, self.timeoutVal);
    } else {
        //calc the index for the next chunk of data points
        nextStartIdx =  self.curStartIdx + self.chunkOffset;

        //make sure it doesn't exceed bounds of the data array
        if (nextStartIdx >= self.dataLen) {
            nextStartIdx = self.dataLen - 1;
        }

        //get the next chunk of data
        dataSlice = self.data.slice(self.curStartIdx, nextStartIdx);
        postMessage({
            status: "loading",
            data: dataSlice
        });
        self.curStartIdx = nextStartIdx;

        //run the next chunk
        self.timeoutObj = setTimeout(processChunk, self.timeoutVal);
    }
}

onmessage = function (e) {
    "use strict";

    var filter = e.data.filter,
        lookupHash = {};

    //save reference to data
    self.data = e.data.data;

    if (filter !== undefined) {
        //create lookup hash based on filter array
        filter.forEach(function (curObj) {
            lookupHash[curObj.offense] = curObj.isSelected;
        });

        self.data = self.data.filter(function (curArr) {
            //if the offense type for the data point is in
            //the list, then include it
            return (lookupHash[curArr[2]] === true);
        });
    }
    self.dataLen = self.data.length;

    //start the timeout "loop"
    self.timeoutObj = setTimeout(processChunk, self.timeoutVal);
};
