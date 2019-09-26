import Vue from 'vue';
import Vuex from 'vuex';
import Track from './Track';
import {
  clickEventLoop,
  setClickPan,
  resetClickEventLoopCount,
  setClickGain,
  getClickBeats
} from './click';
import { initMidiEvents } from './midi';

Vue.use(Vuex);

const trackAudioContext = new AudioContext();
const trackStereoPannerNode = new StereoPannerNode(trackAudioContext, {
  pan: 0
});

let eventLoopStart = trackAudioContext.currentTime;
let trackEventLoopCount = 0;

const store = new Vuex.Store({
  state: {
    playState: 'stopped',
    playPosition: 0,
    tracks: [],
    clickActive: false,
    clickBpm: 102,
    clickGainValue: 1,
    trackGainValue: 1,
    soloTrack: null,
    dialog: null,
    trackPanning: 0,
    clickPanning: 0,
    loading: true,
    clickTimeSignature: {
      beats: 4,
      unit: 4
    },
    midiDeviceName: null,
    controlEditMode: null,
    controlEditSelected: null,
    /**
     * { [actionName]: { type: 'note' | 'controlChange' | 'key', value: any } }
     */
    controlEditMap: {}
  },
  getters: {
    getTrack(state) {
      return track => state.tracks.find(_ => _ === track);
    },
    playBeatsPosition(state) {
      return getClickBeats(state);
    },
    getControlMapping(state) {
      return controlName => state.controlEditMap[controlName];
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
    setMasterTrackGainValue(state, value) {
      state.trackGainValue = value;
    },
    setClickGainValue(state, value) {
      state.clickGainValue = value;
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
    },
    setClickTimeSignature(state, value) {
      state.clickTimeSignature = value;
    },
    setMidiDeviceName(state, value) {
      state.midiDeviceName = value;
    },
    setControlEditMode(state, value) {
      state.controlEditMode = value;
    },
    setControlEditSelected(state, value) {
      state.controlEditSelected = value;
    },
    setControlEdit(state, value) {
      state.controlEditMap[state.controlEditSelected] = value;
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
      resetClickEventLoopCount();
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
    setMasterTrackGainValue({ commit, state }, value) {
      commit('setMasterTrackGainValue', value);
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
      setClickPan(value);
    },
    setClickBpm({ commit }, value) {
      commit('setClickBpm', value);
    },
    setClickGainValue({ commit }, value) {
      commit('setClickGainValue', value);
      setClickGain(value);
    },
    setClickTimeSignature({ commit }, value) {
      commit('setClickTimeSignature', value);
    },
    setMidiDeviceName({ commit }, value) {
      commit('setMidiDeviceName', value);
      initMidiEvents(value, store);
    },
    toggleControlEditMode({ commit, state }) {
      commit('setControlEditMode', !state.controlEditMode);
      commit('setDialog', null);
    },
    setControlEditSelected({ commit }, value) {
      commit('setControlEditSelected', value);
    },
    setControlEdit({ commit, dispatch }, { type, value }) {
      commit('setControlEdit', { type, value });
      dispatch('toggleControlEditMode');
    },
    triggerControlAction({ state, dispatch }, eventValue) {
      Object.entries(state.controlEditMap).find(([action, mapValue]) => {
        if (
          mapValue.type === eventValue.type &&
          mapValue.value === eventValue.value
        ) {
          dispatch(action);
        }
      });
    }
  }
});

function setTrackGain(track) {
  track.setGain(store.state.trackGainValue, store.state.soloTrack);
}

const trackEventLoopInterval = 0.01;

setInterval(() => {
  if (store.state.playState === 'playing') {
    const trackDelta = trackAudioContext.currentTime - eventLoopStart;
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
