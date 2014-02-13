var curStartIdx = 0,
    chunkOffset = 512,
    data = [],
    dataLen = 0,
    timeoutVal = 100, //milliseconds
    timeoutObj;

onmessage = function (e) {
    //save reference to data
    self.data = e.data;
    self.dataLen = self.data.length;

    //start the timeout "loop"
    self.timeoutObj = setTimeout(processChunk, self.timeoutVal);
}

function processChunk() {
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