import { setClickPan, setClickGain } from '../click';
import { initMidiEvents } from '../midi';
import { setTrackGain, tracksStereoPannerNode } from '../tracks';
import { set, get } from '../database';

const store = {
  state: {
    trackPanning: 0,
    clickPanning: 0,
    midiDeviceName: null,
    clickGainValue: 1,
    trackGainValue: 1,
    /**
     * { [actionName]: { type: 'note' | 'controlChange' | 'key', value: any } }
     */
    controlEditMap: {}
  },
  getters: {
    getControlMapping(state) {
      return controlName => state.controlEditMap[controlName];
    }
  },
  mutations: {
    setTrackPanning(state, value) {
      state.trackPanning = value;
    },
    setClickPanning(state, value) {
      state.clickPanning = value;
    },
    setMidiDeviceName(state, value) {
      state.midiDeviceName = value;
    },
    setControlEdit(state, value) {
      state.controlEditMap[state.controlEditSelected] = value;
    },
    setMasterTrackGainValue(state, value) {
      state.trackGainValue = value;
    },
    setClickGainValue(state, value) {
      state.clickGainValue = value;
    }
  },
  actions: {
    setMasterTrackGainValue({ commit, rootState }, value) {
      commit('setMasterTrackGainValue', value);
      rootState.tracks.forEach(setTrackGain);
      saveSettings();
    },
    setTrackPanning({ commit }, value) {
      commit('setTrackPanning', value);
      tracksStereoPannerNode.pan.value = value;
      saveSettings();
    },
    setClickPanning({ commit }, value) {
      commit('setClickPanning', value);
      setClickPan(value);
      saveSettings();
    },
    setMidiDeviceName({ commit, rootState, dispatch }, value) {
      commit('setMidiDeviceName', value);
      initMidiEvents(value, { rootState, dispatch });
      saveSettings();
    },
    setControlEdit({ commit, dispatch }, { type, value }) {
      commit('setControlEdit', { type, value });
      dispatch('toggleControlEditMode');
      saveSettings();
    },
    setClickGainValue({ commit }, value) {
      commit('setClickGainValue', value);
      setClickGain(value);
      saveSettings();
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
};

function saveSettings() {
  set('settings', store.state);
}

export async function initSettings() {
  const settings = await get('settings');
  Object.assign(store.state, settings);
}

export default store;