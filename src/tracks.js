import Track from './Track';

export const tracksAudioContext = new AudioContext();
export const tracksStereoPannerNode = new StereoPannerNode(tracksAudioContext, {
  pan: 0
});

export function setTrackGain(track, state) {
  track.setGain(state.trackGainValue, state.soloTrack);
}

export function newTrack(arrayBuffer) {
  new Track({
    arrayBuffer,
    audioContext: tracksAudioContext,
    stereoPannerNode: tracksStereoPannerNode
  });
}
