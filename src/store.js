import Vue from 'vue';
import Vuex from 'vuex';
import Track from './Track';

Vue.use(Vuex);

const audioContext = new AudioContext();
const stereoPannerNode = new StereoPannerNode(audioContext, {
  pan: 0
});

//stereoPannerNode.pan.value = -1;

const store = new Vuex.Store({
  state: {
    playState: 'stopped',
    playPosition: 0,
    tracks: [],
    clickActive: false,
    clickBpm: '72',
    masterGainValue: 1,
    soloTrack: null,
    dialog: null
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
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      if (newState === 'playing') {
        state.tracks.forEach(track =>
          track.play(audioContext.currentTime, state.playPosition)
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
    },
    addTrack({ commit }, arrayBuffer) {
      const track = new Track({
        arrayBuffer,
        audioContext,
        stereoPannerNode,
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
    }
  }
});

function setTrackGain(track) {
  track.setGain(store.state.masterGainValue, store.state.soloTrack);
}

let eventLoopCount = 0;
const eventLoopInterval = 100;
const eventLoopStart = performance.now();
function frame() {
  const delta = performance.now() - eventLoopStart;
  if (delta / eventLoopCount > eventLoopInterval) {
    eventLoop();
    eventLoopCount++;
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

function eventLoop() {
  if (store.state.playState === 'playing') {
    store.commit(
      'setPlayPosition',
      store.state.playPosition + eventLoopInterval / 1000
    );
  }
  store.state.tracks.forEach(track =>
    track.eventLoop(store.state.playPosition)
  );
}

export default store;
