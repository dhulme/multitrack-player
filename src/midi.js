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

export function initMidiEvents(input, store) {
  function eventHandler() {
    if (store.state.controlEditMode === 'midi') {
      store.dispatch('setControlEditMidi', event);
    }
  }

  input.removeListener();
  input.addListener('noteon', 'all', eventHandler);
  input.addListener('controlchange', 'all', eventHandler);
}
