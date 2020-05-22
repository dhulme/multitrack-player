import WaveSurfer from 'wavesurfer.js';

export default class Track {
  constructor({ audioContext, stereoPannerNode, name }) {
    this.name = name;
    this.audioContext = audioContext;
    this.stereoPannerNode = stereoPannerNode;
    this.ready = false;
    this.gainNode = audioContext.createGain();
    this.gainValue = 1;
    this.active = true;
    this.playing = false;
  }

  async init(arrayBuffer) {
    const audioBuffer = await new Promise(res =>
      this.audioContext.decodeAudioData(arrayBuffer, res)
    );
    this.audioBuffer = audioBuffer;
    this.initAudioSource();
    this.ready = true;
  }

  initAudioSource() {
    this.audioSource = this.audioContext.createBufferSource();
    this.audioSource.buffer = this.audioBuffer;
    this.audioSource
      .connect(this.gainNode)
      .connect(this.stereoPannerNode)
      .connect(this.audioContext.destination);
  }

  play(when, offset = 0) {
    if (this.playing) {
      this.audioSource.stop(when);
    }

    this.initAudioSource();
    this.audioSource.start(when, offset);
    this.playing = true;
  }

  pause(when) {
    this.audioSource.stop(when);
    this.playing = false;
  }

  stop(when) {
    this.audioSource.stop(when);
    this.playing = false;
  }

  setWaveformPlayheadTime(playheadTime) {
    this.waveSurfer.seekTo(playheadTime / this.audioBuffer.duration);
  }

  initWaveform(options) {
    this.waveSurfer = WaveSurfer.create({ interact: false, ...options });
    this.waveSurfer.loadDecodedBuffer(this.audioBuffer);
  }

  isSoloOrActive(soloTrack) {
    if (soloTrack === this) {
      return true;
    } else if (soloTrack !== null) {
      return false;
    } else {
      return this.active;
    }
  }

  setGain(trackGainValue, soloTrack) {
    this.gainNode.gain.value = this.isSoloOrActive(soloTrack)
      ? trackGainValue + this.gainValue - 1
      : 0;
  }

  eventLoop(playPosition) {
    if (this.waveSurfer) {
      this.setWaveformPlayheadTime(playPosition);
    }
  }
}
