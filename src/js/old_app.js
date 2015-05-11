var sinewaveCanvas, frequencyBarsCanvas,
    sinewaveGraph, frequencyBarsGraph;

sinewaveCanvas = document.querySelector('.sinewave');
frequencyBarsCanvas = document.querySelector('.frequency');

sinewaveGraph = function (analyser) {
    var canvas, canvasCtx, WIDTH, HEIGHT,
        bufferLength, dataArray,
        draw;

    canvas = document.querySelector('.sinewave');
    canvasCtx = canvas.getContext('2d');
    WIDTH = canvas.width;
    HEIGHT = canvas.height;

    analyser.fftSize = 2048; // Why this size?
    bufferLength = analyser.fftSize;
    dataArray = new Uint8Array(bufferLength);

    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

    draw = function () {
        drawVisual = requestAnimationFrame(draw);
        analyser.getByteTimeDomainData(dataArray);

        canvasCtx.fillStyle = 'rgb(200, 200, 200)';
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

        canvasCtx.beginPath();

        var sliceWidth = WIDTH * 1.0 / bufferLength;
        var x = 0;

        for (var i = 0; i < bufferLength; i++) {

            var v = dataArray[i] / 128.0;
            var y = v * HEIGHT / 2;

            if (i === 0) {
                canvasCtx.moveTo(x, y);
            } else {
                canvasCtx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        canvasCtx.lineTo(canvas.width, canvas.height / 2);
        canvasCtx.stroke();
    };

    draw();
};

frequencyBarsGraph = function (analyser) {
    var canvas, canvasCtx, WIDTH, HEIGHT,
        bufferLength, dataArray,
        draw;

    canvas = document.querySelector('.frequency');
    canvasCtx = canvas.getContext('2d');
    WIDTH = canvas.width;
    HEIGHT = canvas.height;

    analyser.fftSize = 2048;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

    draw = function () {
        drawVisual = requestAnimationFrame(draw);

        analyser.getByteFrequencyData(dataArray);

        canvasCtx.fillStyle = 'rgb(0, 0, 0)';
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        var barWidth = (WIDTH / bufferLength) * 2.5;
        var barHeight;
        var x = 0;

        for (var i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];

            canvasCtx.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
            canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);

            x += barWidth + 1;
        }
    };

    draw();
};

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
navigator.getUserMedia({audio: true}, function (stream) {
    var audioContext, sinewaveAnalyser, frequencyBarsAnalyser,
        mediaStreamSource, bufferLength, dataArray;

    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContext();
    mediaStreamSource = audioContext.createMediaStreamSource(stream);

    mediaStreamSource.connect(audioContext.destination);

    sinewaveAnalyser = audioContext.createAnalyser();
    mediaStreamSource.connect(sinewaveAnalyser);

    frequencyBarsAnalyser = audioContext.createAnalyser();
    mediaStreamSource.connect(frequencyBarsAnalyser);

    sinewaveGraph(sinewaveAnalyser);
    frequencyBarsGraph(frequencyBarsAnalyser);
}, function () {
    console.log(arguments);
});