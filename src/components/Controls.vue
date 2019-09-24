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
      class="input-thin"
      single-line
      hide-details
      v-model="clickBpm"
    />
    <VTextField
      class="input-thin"
      single-line
      hide-details
      v-model="clickTimeSignature"
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

    <VBtn text icon @click="$store.dispatch('toggleSettingsDialog')">
      <VIcon>{{ mdiWrench }}</VIcon>
    </VBtn>
    <VBtn text icon @click="$store.dispatch('toggleAboutDialog')">
      <VIcon>{{ mdiInformation }}</VIcon>
    </VBtn>
  </VRow>
</template>

<script>
import Clock from './Clock';
import { mdiMetronome, mdiStop, mdiWrench, mdiInformation } from '@mdi/js';

export default {
  components: {
    Clock
  },
  data() {
    return {
      mdiStop,
      mdiMetronome,
      mdiWrench,
      mdiInformation
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
    },
    clickBpm: {
      get() {
        return this.$store.state.clickBpm;
      },
      set(value) {
        this.$store.dispatch('setClickBpm', value);
      }
    },
    clickTimeSignature: {
      get() {
        const { beats, unit } = this.$store.state.clickTimeSignature;
        return `${beats}/${unit}`;
      },
      set(value) {
        const [beats, unit] = value.split('/');
        this.$store.dispatch('setClickTimeSignature', {
          beats: Number(beats) || '',
          unit: Number(unit) || ''
        });
      }
    }
  }
};
</script>

<style lang="scss">
.input-thin {
  max-width: 4rem;
  margin: 0 0.5rem;
}
.input-thin input {
  text-align: center;
}
</style>

<style lang="scss" scoped>
.gain {
  max-width: 10rem;
}
</style>
