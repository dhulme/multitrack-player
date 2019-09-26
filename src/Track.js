let id = 0; // TODO improve ID mechanism
import peaks from 'peaks.js';

export default class Track {
  constructor({ arrayBuffer, audioContext, stereoPannerNode }) {
    this.id = id++;
    this.name = `Track ${id}`;
    this.audioContext = audioContext;
    this.stereoPannerNode = stereoPannerNode;
    this.ready = false;
    this.gainNode = audioContext.createGain();
    this.gainValue = 1;
    this.active = true;

    audioContext.decodeAudioData(arrayBuffer, audioBuffer => {
      this.audioBuffer = audioBuffer;
      this.initAudioSource();
      this.ready = true;
    });
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
    this.audioSource.start(when, offset);
  }

  pause(when) {
    this.audioSource.stop(when);
    this.initAudioSource();
  }

  stop(when) {
    this.audioSource.stop(when);
    this.initAudioSource();
  }

  setPeaksPlayheadTime(playheadTime) {
    this.peaksOverview._playheadLayer.stop(playheadTime);
  }

  initPeaks(options) {
    this.peaks = peaks.init(
      {
        ...options,
        webAudio: {
          audioBuffer: this.audioSource.buffer
        }
      },
      () => {
        this.peaksOverview = this.peaks.views.getView('overview');
      }
    );
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
    if (this.peaksOverview) {
      this.setPeaksPlayheadTime(playPosition);
    }
  }
}
