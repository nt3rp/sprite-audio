# sprite-audio

A simple set of tools to take some audio source in a browser (e.g. file, or microphone) and use that source as input to
animate a sprite.

## Motivation

While working on a [podcast with some friends](http://soundcloud.com/thenickscast), we talked about putting it up on
Youtube. I felt that, rather than have a static image for the podcast, it would add some personality to animate our
voices. However, I didn't feel like doing the animation by hand, so I started to make this to automate the process.

## Installation

``` bash
# Install all dependencies and build the application
> npm install
```

Note: I have been using [this sprite sheet](http://www.court-records.net/sheets/DSsheet-phoenix.png) for experimenting 
but for legal reasons it is not included in the project.

## API Reference

TBD

## Tests

Not at the moment, I'm afraid

## Thanks

- https://github.com/mdn/voice-change-o-matic
- https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API
- https://github.com/foxdog-studios/beetnik/blob/master/src/client/lib/sound_energy_beat_detector.coffee
- http://archive.gamedev.net/archive/reference/programming/features/beatdetection/index.html
- http://papers.traustikristjansson.info/?p=486
- https://wiki.mozilla.org/Audio_Data_API
- https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
- http://gingertech.net/2011/05/01/html5-multi-track-audio-or-video/

## License

MIT
