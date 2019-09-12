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

    audioContext.decodeAudioData(arrayBuffer, buffer => {
      this.source = audioContext.createBufferSource();
      this.source.buffer = buffer;
      this.source.connect(audioContext.destination);
      this.ready = true;
    });
  }

  play(when) {
    this.source.start(when);
    this.startedTime = when;
  }

  stop(when) {
    this.source.stop(when);
  }

  getPlayheadTime() {
    return this.audioContext.currentTime - this.startedTime;
  }

  initPeaks(options) {
    this.peaks = peaks.init(
      {
        ...options,
        webAudio: {
          audioBuffer: this.source.buffer
        }
      },
      () => {
        this.peaksOverview = this.peaks.views.getView('overview');
      }
    );
  }

  eventLoop() {
    if (this.peaksOverview && this.startedTime) {
      this.peaksOverview._playheadLayer.stop(this.getPlayheadTime());
    }
  }
}
