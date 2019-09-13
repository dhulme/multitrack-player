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

    // store.watch((state) => state.masterGainValue, value => console.log('updating', value))
    // store.watch(state =)

    // store.watch((state, getters) => getters.getTrack(this), () => console.log('gain changed'))

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

  setGain(masterGainValue) {
    this.gainNode.gain.value = this.active
      ? masterGainValue + this.gainValue - 1
      : 0;
  }

  eventLoop(playPosition) {
    if (this.peaksOverview) {
      this.setPeaksPlayheadTime(playPosition);
    }
  }
}
