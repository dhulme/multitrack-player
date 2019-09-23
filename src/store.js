import Vue from 'vue';
import Vuex from 'vuex';
import Track from './Track';

Vue.use(Vuex);

const trackAudioContext = new AudioContext();
const trackStereoPannerNode = new StereoPannerNode(trackAudioContext, {
  pan: 0
});

const clickAudioContext = new AudioContext();
const clickStereoPannerNode = new StereoPannerNode(clickAudioContext, {
  pan: 0
});
let clickAudioBuffer = null;
let clickUpAudioBuffer = null;

let eventLoopStart = performance.now();
let trackEventLoopCount = 0;
let clickEventLoopCount = 0;

const store = new Vuex.Store({
  state: {
    playState: 'stopped',
    playPosition: 0,
    tracks: [],
    clickActive: false,
    clickBpm: 102,
    masterGainValue: 1,
    soloTrack: null,
    dialog: null,
    trackPanning: 0,
    clickPanning: 0,
    clickCount: 0,
    loading: true
  },
  getters: {
    getTrack(state) {
      return track => state.tracks.find(_ => _ === track);
    }
  },
  mutations: {
    setPlayState(state, value) {
      state.playState = value;
    },
    /**
     * @param {Track} track
     */
    addTrack(state, track) {
      state.tracks.push(track);
    },
    removeTrack(state, track) {
      state.tracks.splice(state.tracks.indexOf(track), 1);
    },
    setClickActive(state, value) {
      state.clickActive = value;
    },
    setPlayPosition(state, value) {
      state.playPosition = value;
    },
    setMasterGainValue(state, value) {
      state.masterGainValue = value;
    },
    setTrackGainValue(state, { track, value }) {
      track.gainValue = value;
    },
    setTrackActive(state, { track, value }) {
      track.active = value;
    },
    setSoloTrack(state, track) {
      state.soloTrack = track;
    },
    setDialog(state, dialog) {
      state.dialog = dialog;
    },
    setTrackPanning(state, value) {
      state.trackPanning = value;
    },
    setClickPanning(state, value) {
      state.clickPanning = value;
    },
    setClickCount(state, value) {
      state.clickCount = value;
    },
    setClickBpm(state, value) {
      state.clickBpm = value;
    },
    setLoading(state, value) {
      state.loading = value;
    }
  },
  actions: {
    playPause({ state, commit }) {
      if (state.playState === 'stopped') {
        eventLoopStart = performance.now();
      }

      const states = {
        stopped: 'playing',
        paused: 'playing',
        playing: 'paused'
      };
      const newState = states[state.playState];
      commit('setPlayState', newState);
      if (trackAudioContext.state === 'suspended') {
        trackAudioContext.resume();
      }
      if (newState === 'playing') {
        state.tracks.forEach(track =>
          track.play(trackAudioContext.currentTime, state.playPosition)
        );
      } else {
        state.tracks.forEach(track => track.pause());
      }
    },
    stop({ commit, state }) {
      if (state.playState === 'playing') {
        state.tracks.forEach(track => track.stop());
      }
      commit('setPlayState', 'stopped');
      commit('setPlayPosition', 0);
      commit('setClickCount', 0);
      trackEventLoopCount = 0;
      clickEventLoopCount = 0;
      state.tracks.forEach(track => track.eventLoop(store.state.playPosition));
    },
    addTrack({ commit }, arrayBuffer) {
      const track = new Track({
        arrayBuffer,
        audioContext: trackAudioContext,
        stereoPannerNode: trackStereoPannerNode,
        store
      });
      commit('addTrack', track);
    },
    removeTrack({ commit }, track) {
      commit('removeTrack', track);
    },
    toggleClickActive({ commit, state }) {
      commit('setClickActive', !state.clickActive);
    },
    setMasterGainValue({ commit, state }, value) {
      commit('setMasterGainValue', value);
      state.tracks.forEach(setTrackGain);
    },
    setTrackGainValue({ commit }, { track, value }) {
      commit('setTrackGainValue', { track, value });
      setTrackGain(track);
    },
    setTrackActive({ commit }, { track, value }) {
      commit('setTrackActive', { track, value });
      setTrackGain(track);
    },
    setSoloTrack({ commit, state }, track) {
      commit('setSoloTrack', track);
      state.tracks.forEach(setTrackGain);
    },
    toggleSettingsDialog({ commit, state }) {
      commit('setDialog', state.dialog === 'settings' ? null : 'settings');
    },
    toggleAboutDialog({ commit, state }) {
      commit('setDialog', state.dialog === 'about' ? null : 'about');
    },
    setTrackPanning({ commit }, value) {
      commit('setTrackPanning', value);
      trackStereoPannerNode.pan.value = value;
    },
    setClickPanning({ commit }, value) {
      commit('setClickPanning', value);
      clickStereoPannerNode.pan.value = value;
    },
    setClickBpm({ commit }, value) {
      commit('setClickBpm', value);
    }
  }
});

// Fetch metronome audio files
(async () => {
  const metronome = await fetch('./metronome.wav');
  const metronomeArrayBuffer = await metronome.arrayBuffer();

  const metronomeUp = await fetch('./metronome-up.wav');
  const metronomeUpArrayBuffer = await metronomeUp.arrayBuffer();

  clickAudioContext.decodeAudioData(metronomeArrayBuffer, audioBuffer => {
    clickAudioBuffer = audioBuffer;

    clickAudioContext.decodeAudioData(metronomeUpArrayBuffer, audioBuffer => {
      clickUpAudioBuffer = audioBuffer;

      store.commit('setLoading', false);
    });
  });
})();

function setTrackGain(track) {
  track.setGain(store.state.masterGainValue, store.state.soloTrack);
}

const trackEventLoopInterval = 100;

function frame() {
  if (store.state.playState === 'playing') {
    const delta = performance.now() - eventLoopStart;
    if (delta / trackEventLoopCount > trackEventLoopInterval) {
      trackEventLoop();
      trackEventLoopCount++;
    }
    const clickInterval = (60 * 1000) / (store.state.clickBpm / 1);
    if (delta / clickEventLoopCount > clickInterval) {
      clickEventLoop();
      clickEventLoopCount++;
    }
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

function trackEventLoop() {
  store.commit(
    'setPlayPosition',
    store.state.playPosition + trackEventLoopInterval / 1000
  );
  store.state.tracks.forEach(track =>
    track.eventLoop(store.state.playPosition)
  );
}

function clickEventLoop() {
  if (store.state.playState === 'playing') {
    if (store.state.clickCount === 4) {
      store.commit('setClickCount', 0);
    }
    const bufferSource = clickAudioContext.createBufferSource();
    bufferSource
      .connect(clickStereoPannerNode)
      .connect(clickAudioContext.destination);
    if (store.state.clickCount === 0) {
      bufferSource.buffer = clickUpAudioBuffer;
      bufferSource.start();
    } else {
      bufferSource.buffer = clickAudioBuffer;
      bufferSource.start();
    }
    store.commit('setClickCount', store.state.clickCount + 1);
  }
}

export default store;
