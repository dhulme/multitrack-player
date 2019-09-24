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

let eventLoopStart = trackAudioContext.currentTime;
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
    setClickBpm(state, value) {
      state.clickBpm = value;
    },
    setLoading(state, value) {
      state.loading = value;
    }
  },
  actions: {
    playPause({ state, commit }) {
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
        eventLoopStart = trackAudioContext.currentTime;
        trackEventLoopCount = 0;
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

const trackEventLoopInterval = 0.01;

setInterval(() => {
  if (store.state.playState === 'playing') {
    const trackDelta = trackAudioContext.currentTime - eventLoopStart;
    if (trackDelta / trackEventLoopCount > trackEventLoopInterval) {
      trackEventLoop();
      trackEventLoopCount++;
    }

    const clickInterval = 60 / (store.state.clickBpm / 1);
    if (store.state.playPosition / clickEventLoopCount > clickInterval) {
      const bufferSource = clickAudioContext.createBufferSource();
      bufferSource
        .connect(clickStereoPannerNode)
        .connect(clickAudioContext.destination);

      if (clickEventLoopCount % 4 === 0) {
        bufferSource.buffer = clickUpAudioBuffer;
        bufferSource.start();
      } else {
        bufferSource.buffer = clickAudioBuffer;
        bufferSource.start();
      }

      clickEventLoopCount++;
    }
  }
}, 1);

function trackEventLoop() {
  store.commit(
    'setPlayPosition',
    store.state.playPosition + trackEventLoopInterval
  );
  store.state.tracks.forEach(track =>
    track.eventLoop(store.state.playPosition)
  );
}

export default store;
