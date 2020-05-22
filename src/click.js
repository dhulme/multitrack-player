const audioContext = new AudioContext();

const stereoPannerNode = new StereoPannerNode(audioContext, {
  pan: 0
});
const gainNode = audioContext.createGain();

let audioBuffer = null;
let upAudioBuffer = null;

let eventLoopCount = 0;

// Fetch click audio files
export async function initClick() {
  const click = await fetch('./click.wav');
  const clickArrayBuffer = await click.arrayBuffer();

  const clickUp = await fetch('./click-accent.wav');
  const clickUpArrayBuffer = await clickUp.arrayBuffer();

  return new Promise(res => {
    audioContext.decodeAudioData(clickArrayBuffer, _ => {
      audioBuffer = _;

      audioContext.decodeAudioData(clickUpArrayBuffer, _ => {
        upAudioBuffer = _;

        res();
      });
    });
  });
}

export function clickEventLoop(store) {
  const { beats, unit } = store.state.clickTimeSignature;
  if (!beats || !unit) {
    return;
  }

  const clickInterval = getClickInterval(store.state);
  if (store.state.playPosition / eventLoopCount > clickInterval) {
    const bufferSource = audioContext.createBufferSource();
    bufferSource
      .connect(gainNode)
      .connect(stereoPannerNode)
      .connect(audioContext.destination);

    if (eventLoopCount % beats === 0) {
      bufferSource.buffer = upAudioBuffer;
      bufferSource.start();
    } else {
      bufferSource.buffer = audioBuffer;
      bufferSource.start();
    }

    eventLoopCount++;
  }
}

export function setClickPan(value) {
  stereoPannerNode.pan.value = value;
}

export function setClickEventLoopCount(count) {
  eventLoopCount = count;
}

export function setClickGain(value) {
  gainNode.gain.value = value;
}

export function getClickInterval(state) {
  return 60 / (state.clickBpm * (state.clickTimeSignature.unit / 4));
}

export function getClickBeats(state) {
  const beats = Math.floor(state.playPosition / getClickInterval(state));
  return [
    Math.floor(beats / state.clickTimeSignature.beats),
    (beats % state.clickTimeSignature.beats) + 1
  ];
}
