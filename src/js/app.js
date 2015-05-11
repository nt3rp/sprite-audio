navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
window.AudioContext = window.AudioContext || window.webkitAudioContext;

var Sprite = window.Sprite = (function () {
    var self = {},
        handleMic,
        handleVolume,
        frequencyBarsGraph,
        beatDetect,
        volume,
        error,
        sampleRate,
        config;

    // TODO: Pitch: Max(Average of X bars)?
    volume = function (data) {
        var values, average, length, i;

        values = 0;
        length = data.length;
        for (i = 0; i < length; i++) {
            values += data[i];
        }

        average = values / length;
        return average;
    };

    // Lots of help from
    // https://github.com/foxdog-studios/beetnik/blob/master/src/client/lib/sound_energy_beat_detector.coffee
    // http://archive.gamedev.net/archive/reference/programming/features/beatdetection/index.html
    // http://papers.traustikristjansson.info/?p=486
    beatDetect = function (analyser) {
        // Analyser node is strictly for visualizations?
        var data, onFrame, bufferSize;

        analyser.fftSize = 2048;
        bufferSize = analyser.frequencyBinCount;
        data = new Uint8Array(analyser.frequencyBinCount);

        onFrame = function () {
            var i, instantEnergy, maxEnergy, energies;
            requestAnimationFrame(onFrame);
            // Is this PCM data, or not?
            analyser.getByteFrequencyData(data);
        }
    };

    handleVolume = function (analyser) {
        var data, onFrame, prevVol;

        analyser.fftSize = 2048;
        data = new Uint8Array(analyser.frequencyBinCount);

        onFrame = function () {
            var vol;

            requestAnimationFrame(onFrame);
            analyser.getByteFrequencyData(data);

            prevVol = prevVol || 0;
            vol = volume(data);

            // TODO: Cleanup audio before trying to take volume?
            // TODO: Some sort of rate limiting (e.g. don't need to check on every frame
            // TODO: Only change volume if above some threshold.
            // TODO: Determine what the average overall volume is to get a better idea of how new time frame compares
            document.querySelector('#volume').innerText = vol;
            prevVol = vol;
        };
        onFrame();
    };

    frequencyBarsGraph = function (analyser) {
        var canvas, canvasCtx, WIDTH, HEIGHT, dataArray, draw, bufferLength;

        canvas = document.querySelector('.frequency');
        canvasCtx = canvas.getContext('2d');
        WIDTH = canvas.width;
        HEIGHT = canvas.height;

        analyser.fftSize = 256;
        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);

        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

        draw = function () {
            requestAnimationFrame(draw);

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

    handleMic = function (stream) {
        var audioContext, mediaStreamSource, analyser;

        audioContext = new AudioContext();
        mediaStreamSource = audioContext.createMediaStreamSource(stream);

        sampleRate = audioContext.sampleRate;

        // Allows us to actually hear what we record; not strictly necessary when using a microphone
        mediaStreamSource.connect(audioContext.destination);

        analyser = audioContext.createAnalyser();
        mediaStreamSource.connect(analyser);
        beatDetect(analyser);

//                    analyser = audioContext.createAnalyser();
//                    mediaStreamSource.connect(analyser);
//                    handleVolume(analyser);

//                    analyser = audioContext.createAnalyser();
//                    mediaStreamSource.connect(analyser);
//                    frequencyBarsGraph(analyser);
    };

    error = function () {
        console.log("There was some error getting a stream?", arguments);
    };

    self.Setup = function () {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
    };

    self.Start = function (conf) {
        config = conf || {};
        self.Setup();
        navigator.getUserMedia({audio: true}, handleMic, error);
    };

    return self;
}());

Sprite.Start();