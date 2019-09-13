import Vue from 'vue';
import Vuex from 'vuex';
import Track from './Track';

Vue.use(Vuex);

const audioContext = new AudioContext();

const store = new Vuex.Store({
  state: {
    playState: 'stopped',
    playPosition: 0,
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
    },
    setPlayPosition(state, value) {
      state.playPosition = value;
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
