import Vue from 'vue';
import Vuex from 'vuex';
import Track from './Track';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    playState: 'stopped',
    tracks: []
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
    }
  },
  actions: {
    playPause({ state, commit }) {
      const states = {
        stopped: 'playing',
        paused: 'playing',
        playing: 'paused'
      };
      commit('setPlayState', states[state.playState]);
    },
    stop({ commit }) {
      commit('setPlayState', 'stopped');
    },
    addTrack({ commit }, buffer) {
      commit(
        'addTrack',
        new Track({
          buffer
        })
      );
    }
  }
});
