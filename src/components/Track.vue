<template>
  <VCard class="mb-4">
    <VCardText>
      <VRow no-gutters>
        <VCol cols="12" sm="3" class="pr-4">
          <VTextField v-model="track.name" />
          <VRow dense justify="space-between">
            <VBtn
              :outlined="!track.active"
              :color="activeColor"
              @click="toggleActive"
              >{{ number }}</VBtn
            >
            <VBtn :outlined="!solo" color="primary" @click="toggleSolo"
              >Solo</VBtn
            >
            <VBtn icon @click="remove">
              <VIcon>mdi-delete</VIcon>
            </VBtn>
          </VRow>
          <VSlider
            hide-details
            class="mt-4"
            v-model="gain"
            min="0"
            max="1.5"
            step="0.01"
          />
        </VCol>
        <VCol cols="12" sm="9" class="container text-center">
          <VProgressCircular
            indeterminate
            v-if="!track.ready"
            class="progress"
          />
          <div ref="waveformContainer" />
        </VCol>
      </VRow>
    </VCardText>
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
  computed: {
    gain: {
      get() {
        return this.track.gainValue;
      },
      set(value) {
        return this.$store.dispatch('setTrackGainValue', {
          track: this.track,
          value
        });
      }
    },
    solo() {
      return this.$store.state.soloTrack === this.track;
    },
    activeColor() {
      const soloTrack = this.$store.state.soloTrack;
      return soloTrack === this.track || soloTrack === null
        ? 'primary'
        : 'accent';
    }
  },
  watch: {
    'track.ready'() {
      this.track.initWaveform({
        container: this.$refs.waveformContainer,
        height: 150,
        cursorColor: 'rgba(0, 0, 0, 0.4)',
        waveColor: '#999',
        progressColor: 'rgba(0, 0, 0, 0.4)'
      });
    },
    active(active) {
      this.track.setGainValue(active ? this.gain : 0);
    }
  },
  methods: {
    remove() {
      this.$store.dispatch('removeTrack', this.track);
    },
    toggleActive() {
      this.$store.dispatch('setTrackActive', {
        track: this.track,
        value: !this.track.active
      });
    },
    toggleSolo() {
      this.$store.dispatch('setSoloTrack', this.solo ? null : this.track);
    }
  }
};
</script>

<style lang="scss" scoped>
@media (min-width: 768px) {
  .progress {
    position: absolute;
    left: 47%;
    top: 38%;
  }
}

.container {
  position: relative;
}
</style>
