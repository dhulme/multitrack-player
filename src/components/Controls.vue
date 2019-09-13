<template>
  <VRow justify="end" align="center">
    <VBtn text icon @click="$store.dispatch('playPause')">
      <VIcon>{{ playPauseIcon }}</VIcon>
    </VBtn>
    <VBtn text icon @click="$store.dispatch('stop')">
      <VIcon>{{ mdiStop }}</VIcon>
    </VBtn>

    <VBtn
      text
      icon
      :outlined="$store.state.clickActive"
      @click="$store.dispatch('toggleClickActive')"
      ><VIcon>{{ mdiMetronome }}</VIcon></VBtn
    >
    <VTextField
      class="click-bpm"
      single-line
      hide-details
      :value="$store.state.clickBpm"
    />

    <Clock />

    <VSlider
      class="gain"
      hide-details
      v-model="gain"
      min="0"
      max="1.25"
      step="0.01"
    />
  </VRow>
</template>

<script>
import Clock from './Clock';
import { mdiMetronome, mdiStop } from '@mdi/js';

export default {
  components: {
    Clock
  },
  data() {
    return {
      mdiStop,
      mdiMetronome
    };
  },
  computed: {
    playPauseIcon() {
      return {
        playing: 'mdi-pause',
        paused: 'mdi-play',
        stopped: 'mdi-play'
      }[this.$store.state.playState];
    },
    gain: {
      get() {
        return this.$store.state.masterGainValue;
      },
      set(value) {
        this.$store.dispatch('setMasterGainValue', value);
      }
    }
  }
};
</script>

<style lang="scss">
.click-bpm {
  max-width: 4rem;
}
.click-bpm input {
  text-align: center;
}
</style>

<style lang="scss" scoped>
.gain {
  max-width: 10rem;
}
</style>
