<template>
  <v-row>
    <v-col>
      <div>{{ number }}. {{ name }}</div>
      <v-btn text icon>
        <v-icon>{{ active ? 'volume_up' : 'volume_mute' }}</v-icon>
      </v-btn>
      <v-slider v-model="gain" label="Gain" />
    </v-col>
    <v-col>
      <audio :src="source" ref="audio" />
      <div ref="waveformContainer" />
    </v-col>
  </v-row>
</template>

<script>
import peaks from 'peaks.js';

export default {
  props: {
    active: Boolean,
    audioContext: AudioContext,
    gain: Number,
    name: String,
    number: Number
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
