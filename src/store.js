import Vue from 'vue';
import Vuex from 'vuex';
import Track from './Track';

Vue.use(Vuex);

const audioContext = new AudioContext();

const store = new Vuex.Store({
  state: {
    playState: 'stopped',
    tracks: [],
    clickActive: false,
    clickBpm: '72'
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
    setClickActive(state, value) {
      state.clickActive = value;
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
      state.tracks.forEach(track => track.play(audioContext.currentTime));
    },
    stop({ commit, state }) {
      commit('setPlayState', 'stopped');
      state.tracks.forEach(track => track.stop());
    },
    addTrack({ commit }, arrayBuffer) {
      const track = new Track({
        arrayBuffer,
        audioContext
      });
      commit('addTrack', track);
    },
    toggleClickActive({ commit, state }) {
      commit('setClickActive', !state.clickActive);
    }
  }
});

let eventLoopCount = 0;
const eventLoopInterval = 500;
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
  store.state.tracks.forEach(track => track.eventLoop());
}

export default store;
