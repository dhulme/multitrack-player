<template>
  <VCard>
    <VRow>
      <VCol cols="3">
        <!-- <div>{{ number }}. {{ track.name }}</div> -->
        <!-- <VBtn text icon>
        <VIcon>{{ track.active ? 'mdi-volume-up' : 'mdi-volume-mute' }}</VIcon>
      </VBtn> -->
        <VTextField v-model="track.name" />
        <VBtn
          :outlined="!track.active"
          color="primary"
          @click="track.active = !track.active"
          >{{ number }}</VBtn
        >
        <VSlider v-model="track.gain" label="Gain" />
        <audio src="" ref="audio" />
      </VCol>
      <VCol cols="9">
        <VProgressCircular v-if="!track.ready" indeterminate />
        <div ref="waveformContainer" :style="{ visibility: 'hidden' }" />
      </VCol>
    </VRow>
  </VCard>
</template>

<script>
import Track from '../Track';

export default {
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
    }
  }
};
</script>
