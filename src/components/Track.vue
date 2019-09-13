<template>
  <VCard>
    <VRow>
      <VCol cols="3">
        <VTextField v-model="track.name" />
        <VBtn :outlined="!active" color="primary" @click="active = !active">{{
          number
        }}</VBtn>
        <VSlider v-model="gain" label="Gain" min="0" max="2" step="0.01" />
        <VBtn text icon @click="remove">
          <VIcon>mdi-delete</VIcon>
        </VBtn>
        <audio src="" ref="audio" />
      </VCol>
      <VCol cols="9">
        <VProgressCircular v-if="!track.ready" indeterminate />
        <div ref="waveformContainer" />
      </VCol>
    </VRow>
  </VCard>
</template>

<script>
import Track from '../Track';

export default {
  data() {
    return {
      gain: 1,
      active: true
    };
  },
  props: {
    number: Number,
    track: Track
  },
  mounted() {},
  watch: {
    'track.ready'() {
      this.track.initPeaks({
        mediaElement: this.$refs.audio,
        containers: {
          overview: this.$refs.waveformContainer
        },
        height: 50
      });
    },
    gain(value) {
      if (this.active) {
        this.track.setGainValue(value);
      }
    },
    active(active) {
      this.track.setGainValue(active ? this.gain : 0);
    }
  },
  methods: {
    remove() {
      this.$store.dispatch('removeTrack', this.track);
    }
  }
};
</script>
