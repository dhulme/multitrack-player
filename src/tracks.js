import Track from './Track';

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
    stereoPannerNode: tracksStereoPannerNode
  });
  track.init(arrayBuffer);
  return track;
}

export function playTracks(tracks, position) {
  tracks.forEach(track => track.play(tracksAudioContext.currentTime, position));
}
