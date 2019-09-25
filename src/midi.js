import webMidi from 'webmidi';

export function initMidi() {
  return new Promise((resolve, reject) => {
    webMidi.enable(err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
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
    const value = event.note.number;
    if (store.state.controlEditMode === 'midi') {
      store.dispatch('setControlEditMidi', { type: 'note', value });
    }
  });
  input.addListener('controlchange', 'all', event => {
    const value = { type: 'controlChange', number: event.controller.number };
    if (store.state.controlEditMode === 'midi' && event.value) {
      store.dispatch('setControlEditMidi', value);
    } else {
      store.dispatch('triggerControlAction', value);
    }
  });
}
