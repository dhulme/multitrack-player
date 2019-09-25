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

export function onInputMessage(input, handler) {
  input.removeListener();
  input.addListener('noteon', 'all', handler);
  input.addListener('controlchange', 'all', handler);
}
