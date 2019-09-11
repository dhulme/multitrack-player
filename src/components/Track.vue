<template>
  <VRow>
    <VCol>
      <div>{{ number }}. {{ track.name }}</div>
      <VBtn text icon>
        <VIcon>{{ track.active ? 'volume_up' : 'volume_mute' }}</VIcon>
      </VBtn>
      <VSlider v-model="track.gain" label="Gain" />
    </VCol>
    <VCol>
      <audio :src="track.source" ref="audio" />
      <div ref="waveformContainer" />
    </VCol>
  </VRow>
</template>

<script>
import peaks from 'peaks.js';
import Track from '../Track';

export default {
  props: {
    audioContext: AudioContext,
    number: Number,
    track: Track
  },
  mounted() {
    peaks.init({
      container: this.$refs.waveformContainer,
      mediaElement: this.$refs.audio,
      audioContext: this.props.audioContext,
      height: 100
    });
  }
};
</script>
