<template>
  <VRow justify="end" align="center">
    <VBtn
      icon
      @click="mapControlOrDispatchAction('playPause')"
      class="icon-button"
    >
      <VIcon>{{ playPauseIcon }}</VIcon>
      <VIcon v-if="$store.state.controlEditMode">{{
        getControlMappingIcon('playPause')
      }}</VIcon>
      {{ getControlMappingName('playPause') }}
    </VBtn>
    <VBtn icon @click="mapControlOrDispatchAction('stop')">
      <VIcon>{{ mdiStop }}</VIcon>
    </VBtn>

    <VBtn
      icon
      :outlined="$store.state.clickActive"
      @click="mapControlOrDispatchAction('clickActive', 'toggleClickActive')"
    >
      <VIcon>{{ mdiMetronome }}</VIcon>
    </VBtn>

    <TextField v-model="clickBpm" />
    <TextField v-model="clickTimeSignature" />

    <Clock :values="timeValues" :icon="mdiClockOutline" class="mr-4" />

    <Clock :values="beatsValues" :icon="mdiMusicNote" />

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
import {
  mdiMetronome,
  mdiStop,
  mdiWrench,
  mdiInformation,
  mdiKeyboard,
  mdiPiano,
  mdiMusicNote,
  mdiClockOutline
} from '@mdi/js';

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
      mdiInformation,
      mdiMusicNote,
      mdiClockOutline
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
    mapControlOrDispatchAction(controlName, actionName) {
      if (!this.$store.state.controlEditMode) {
        return this.$store.dispatch(actionName || controlName);
      }

      this.$store.dispatch('setControlEditSelected', controlName);
    },
    getControlMappingIcon(controlName) {
      const controlMapping = this.$store.getters.getControlMapping(controlName);

      if (controlMapping) {
        return {
          key: mdiKeyboard,
          note: mdiPiano,
          controlChange: mdiPiano
        }[controlMapping.type];
      }
    },
    getControlMappingName(controlName) {
      if (!this.$store.state.controlEditMode) {
        return;
      }
      const controlMapping = this.$store.getters.getControlMapping(controlName);
      return controlMapping ? controlMapping.value : '';
    }
  }
};
</script>

<style lang="scss" scoped>
.icon-button {
  text-transform: lowercase;
}
</style>
