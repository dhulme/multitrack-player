import webMidi from 'webmidi';

export function initMidi(store) {
  return new Promise((resolve, reject) => {
    webMidi.enable(err => {
      if (err) {
        store.commit('setMidiSupported', false);
        reject(err);
      } else {
        store.commit('setMidiSupported', true);
        resolve();
      }
    }, true); // Passing true as the second argument to enable MIDI in sysex mode if needed
  });
}

export function inputs() {
  return webMidi.inputs;
}

export function getInput(name) {
  return webMidi.getInputByName(name);
}

export function initMidiEvents(deviceName, store) {
  const input = getInput(deviceName);

  input.removeListener();
  input.addListener('noteon', 'all', event => {
    store.dispatch(
      store.rootState.controlEditMode
        ? 'setControlEdit'
        : 'triggerControlAction',
      { type: 'note', value: event.note.number }
    );
  });
  input.addListener('controlchange', 'all', event => {
    if (event.value !== 127) {
      return;
    }
    store.dispatch(
      store.rootState.controlEditMode
        ? 'setControlEdit'
        : 'triggerControlAction',
      { type: 'controlChange', value: event.controller.number }
    );
  });
}
