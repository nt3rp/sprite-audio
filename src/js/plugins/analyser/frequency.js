var viz = {};

viz.fft = function (analyser, callback) {
    var canvas, canvasCtx, WIDTH, HEIGHT, dataArray, draw, bufferLength;

    analyser.fftSize = 256;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    draw = function () {
        requestAnimationFrame(draw);

        analyser.getByteFrequencyData(dataArray);

        callback(dataArray, bufferLength);
    };

    draw();
};

module.exports = viz;