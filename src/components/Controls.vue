<template>
  <VRow justify="end" align="center">
    <VBtn
      text
      icon
      @click="
        mapControlOrAction('playPause', () => this.$store.dispatch('playPause'))
      "
    >
      <VIcon>{{ playPauseIcon }}</VIcon>
    </VBtn>
    <VBtn
      text
      icon
      @click="mapControlOrAction('stop', () => this.$store.dispatch('stop'))"
    >
      <VIcon>{{ mdiStop }}</VIcon>
    </VBtn>

    <VBtn
      text
      icon
      :outlined="$store.state.clickActive"
      @click="
        mapControlOrAction('clickActive', () =>
          this.$store.dispatch('toggleClickActive')
        )
      "
    >
      <VIcon>{{ mdiMetronome }}</VIcon>
    </VBtn>

    <TextField v-model="clickBpm" />
    <TextField v-model="clickTimeSignature" />

    <Clock :values="timeValues" title="Time" />

    <Clock :values="beatsValues" title="Bars" />

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
import TextField from './TextField';
import { mdiMetronome, mdiStop, mdiWrench, mdiInformation } from '@mdi/js';

export default {
  components: {
    Clock,
    TextField
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
    },
    timeValues() {
      const playPosition = this.$store.state.playPosition;
      return [
        Math.floor(playPosition / 60),
        Math.floor(playPosition % 60),
        Math.floor((playPosition % 1) * 10)
      ];
    },
    beatsValues() {
      return this.$store.getters.playBeatsPosition;
    }
  },
  methods: {
    mapControlOrAction(controlName, handler) {
      if (!this.$store.state.controlEditMode) {
        return handler();
      }

      this.$store.dispatch('setControlEditSelected', controlName);
    }
  }
};
</script>

<style lang="scss" scoped>
.gain {
  max-width: 10rem;
}
</style>
