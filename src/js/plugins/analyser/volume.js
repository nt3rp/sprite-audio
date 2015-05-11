var _ = require('lodash');
var volume = {};

// TODO: Move into util function?
var average = function (arr) {
    return _.sum(arr) / arr.length;
};

volume.average = function (analyser, callback) {
    var data, onFrame, prevVol;

    analyser.fftSize = 2048;
    data = new Uint8Array(analyser.frequencyBinCount);

    onFrame = function () {
        var vol;

        requestAnimationFrame(onFrame);
        analyser.getByteFrequencyData(data);

        prevVol = prevVol || 0;
        vol = average(data);

        // TODO: Cleanup audio before trying to take volume?
        // TODO: Some sort of rate limiting (e.g. don't need to check on every frame
        // TODO: Only change volume if above some threshold.
        // TODO: Determine what the average overall volume is to get a better idea of how new time frame compares
        callback(vol);
        prevVol = vol;
    };

    onFrame();
};

// TODO: Pitch: Max(Average of X bars)?
module.exports = volume;