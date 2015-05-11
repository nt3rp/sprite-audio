var _ = require('lodash');
var volume = require('./plugins/analyser/volume');
var frequency = require('./plugins/analyser/frequency');

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
window.AudioContext = window.AudioContext || window.webkitAudioContext;

var Sprite = window.Sprite = (function () {
    var self = {},
        handleMic,
        handleVolume,
        frequencyBarsGraph,
        beatDetect,
        error,
        sampleRate,
        config;

    handleVolume = function (analyser) {
        var pastVolumes = [];
        var maxLength = 1024;
        var faces = {
            "loud": "(^O^)",
            "normal": "(^-^)",
            "quiet": "(-_-)"
        };

        volume.average(analyser, function(value) {
            // Normalize volume
            if (pastVolumes.length > maxLength) {
                pastVolumes.pop();
            };
            pastVolumes.push(value);

            var max = _.max(pastVolumes);

            var sprite = document.querySelector('.sprite');

            var face;
            switch (true) {
                case _.inRange(value, max*0.25):
                    face = 'quiet';
                    sprite.classList.remove('talking');
                    break;
                case _.inRange(value, max*0.75. max):
                    face = 'loud';
                    break;
                default:
                    face = 'normal';
                    sprite.classList.add('talking');
                    break;
            }

            document.querySelector('#volume').innerText = faces[face];


        })
    };

    frequencyBarsGraph = function (analyser) {
        frequency.fft(analyser, function(buffer, length) {
            var canvas = document.querySelector('.frequency');
            var canvasCtx = canvas.getContext('2d');

            canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
            canvasCtx.fillStyle = 'rgb(0, 0, 0)';
            canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

            var barWidth = (canvas.width / length) * 2.5;
            var barHeight;
            var x = 0;

            for (var i = 0; i < length; i++) {
                barHeight = buffer[i];

                canvasCtx.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
                canvasCtx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);

                x += barWidth + 1;
            }
        });
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
        handleVolume(analyser);
        frequencyBarsGraph(analyser);
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