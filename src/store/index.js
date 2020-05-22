import Vue from 'vue';
import Vuex from 'vuex';
import {
  clickEventLoop,
  setClickEventLoopCount,
  getClickBeats,
  getClickInterval
} from '../click';
import settings from './settings';

import {
  tracksAudioContext,
  newTrack,
  setTrackGain,
  playTracks
} from '../tracks';

Vue.use(Vuex);

let eventLoopStart = tracksAudioContext.currentTime;
let trackEventLoopCount = 0;

const store = new Vuex.Store({
  modules: {
    settings
  },
  state: {
    playState: 'stopped',
    playPosition: 0,
    tracks: [],
    clickActive: false,
    clickBpm: 102,
    soloTrack: null,
    dialog: null,
    loading: true,
    clickTimeSignature: {
      beats: 4,
      unit: 4
    },
    controlEditMode: null,
    controlEditSelected: null
  },
  getters: {
    getTrack(state) {
      return track => state.tracks.find(_ => _ === track);
    },
    playBeatsPosition(state) {
      return getClickBeats(state);
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

    setTrackActive(state, { track, value }) {
      track.active = value;
    },
    setSoloTrack(state, track) {
      state.soloTrack = track;
    },
    setDialog(state, dialog) {
      state.dialog = dialog;
    },
    setClickBpm(state, value) {
      state.clickBpm = value;
    },
    setLoading(state, value) {
      state.loading = value;
    },
    setClickTimeSignature(state, value) {
      state.clickTimeSignature = value;
    },
    setControlEditMode(state, value) {
      state.controlEditMode = value;
    },
    setControlEditSelected(state, value) {
      state.controlEditSelected = value;
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
      if (tracksAudioContext.state === 'suspended') {
        tracksAudioContext.resume();
      }
      if (newState === 'playing') {
        eventLoopStart = tracksAudioContext.currentTime;
        trackEventLoopCount = 0;
        playTracks(state.tracks, state.playPosition);
      } else {
        state.tracks.forEach(track => track.pause());
      }
    },
    playAt({ state, dispatch }, playPosition) {
      dispatch('setPlayPosition', playPosition);
      setClickEventLoopCount(
        Math.floor(playPosition / getClickInterval(state))
      );
      playTracks(state.tracks, state.playPosition);
    },
    stop({ commit, state }) {
      if (state.playState === 'playing') {
        state.tracks.forEach(track => track.stop());
      }
      commit('setPlayState', 'stopped');
      commit('setPlayPosition', 0);
      setClickEventLoopCount(0);
      state.tracks.forEach(track => track.eventLoop(store.state.playPosition));
    },
    addTrack({ commit }, { name, arrayBuffer }) {
      commit('addTrack', newTrack({ name, arrayBuffer }));
    },
    removeTrack({ commit }, track) {
      commit('removeTrack', track);
    },
    toggleClickActive({ commit, state }) {
      commit('setClickActive', !state.clickActive);
    },
    setTrackGainValue({ state }, { track, value }) {
      track.gainValue = value;
      setTrackGain(track, state.settings, state);
    },
    setTrackActive({ commit, state }, { track, value }) {
      commit('setTrackActive', { track, value });
      setTrackGain(track, state.settings, state);
    },
    setSoloTrack({ commit, state }, track) {
      commit('setSoloTrack', track);
      state.tracks.forEach(track => setTrackGain(track, state.settings, state));
    },
    toggleSettingsDialog({ commit, state }) {
      commit('setDialog', state.dialog === 'settings' ? null : 'settings');
    },
    toggleAboutDialog({ commit, state }) {
      commit('setDialog', state.dialog === 'about' ? null : 'about');
    },
    setClickBpm({ commit }, value) {
      commit('setClickBpm', value);
    },
    setClickTimeSignature({ commit }, value) {
      commit('setClickTimeSignature', value);
    },

    toggleControlEditMode({ commit, state }) {
      commit('setControlEditMode', !state.controlEditMode);
      commit('setDialog', null);
    },
    setControlEditSelected({ commit }, value) {
      commit('setControlEditSelected', value);
    },
    setPlayPosition({ commit }, value) {
      commit('setPlayPosition', value);
    }
  }
});

const trackEventLoopInterval = 0.01;

setInterval(() => {
  if (store.state.playState === 'playing') {
    const trackDelta = tracksAudioContext.currentTime - eventLoopStart;
    if (trackDelta / trackEventLoopCount > trackEventLoopInterval) {
      trackEventLoop();
      trackEventLoopCount++;
    }

    clickEventLoop(store);
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
