let id = 0; // TODO improve ID mechanism
import peaks from 'peaks.js';

export default class Track {
  constructor({ arrayBuffer, audioContext }) {
    this.active = false;
    this.id = id++;
    this.name = `Track ${id}`;
    this.audioContext = audioContext;
    this.ready = false;
    this.startedTime = null;

    audioContext.decodeAudioData(arrayBuffer, audioBuffer => {
      this.audioBuffer = audioBuffer;
      this.initAudioSource();
      this.ready = true;
    });
  }

  initAudioSource() {
    this.audioSource = this.audioContext.createBufferSource();
    this.audioSource.buffer = this.audioBuffer;
    this.audioSource.connect(this.audioContext.destination);
  }

  play(when) {
    this.audioSource.start(when);
    this.startedTime = when;
  }

  stop(when) {
    this.audioSource.stop(when);
    this.setPeaksPlayheadTime(0);
    this.startedTime = null;
    this.initAudioSource();
  }

  calculatePlayheadTime() {
    return this.audioContext.currentTime - this.startedTime;
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

  eventLoop() {
    if (this.peaksOverview && this.startedTime !== null) {
      this.setPeaksPlayheadTime(this.calculatePlayheadTime());
    }
  }
}
