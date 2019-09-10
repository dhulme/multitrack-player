import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    playState: 'stopped'
  },
  mutations: {
    setPlayState(state, value) {
      state.playState = value;
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
    }
  }
});
