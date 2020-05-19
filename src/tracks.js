import { queue } from 'async';

import Track from './Track';

const peaksQueue = queue(async ({ track, options }, callback) => {
  await track.initPeaks(options);
  setTimeout(callback, 2500);
});

peaksQueue.drain(() => console.log('done'));

function queuePeaks(track, options) {
  console.log('queing', track);
  peaksQueue.push({ track, options });
}

export const tracksAudioContext = new AudioContext();
export const tracksStereoPannerNode = new StereoPannerNode(tracksAudioContext, {
  pan: 0
});

export function setTrackGain(track, settingsState, rootState) {
  track.setGain(settingsState.trackGainValue, rootState.soloTrack);
}

export function newTrack(arrayBuffer) {
  const track = new Track({
    audioContext: tracksAudioContext,
    stereoPannerNode: tracksStereoPannerNode,
    queuePeaks
  });
  track.init(arrayBuffer);
  return track;
}

export function playTracks(tracks, position) {
  tracks.forEach(track => track.play(tracksAudioContext.currentTime, position));
}
