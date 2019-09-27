<template>
  <VRow justify="end" align="center">
    <VBtn
      v-if="controlEditMode"
      small
      @click="$store.dispatch('toggleControlEditMode')"
      >Done mapping</VBtn
    >
    <VBtn
      icon
      @click="mapControlOrDispatchAction('playPause')"
      :title="getControlMappingName('playPause')"
      :color="getControlMappingColor('playPause')"
    >
      <VIcon>{{ playPauseIcon }}</VIcon>
    </VBtn>
    <VBtn
      icon
      @click="mapControlOrDispatchAction('stop')"
      :title="getControlMappingName('stop')"
      :color="getControlMappingColor('stop')"
    >
      <VIcon>{{ mdiStop }}</VIcon>
    </VBtn>

    <VBtn
      icon
      :outlined="$store.state.clickActive"
      @click="mapControlOrDispatchAction('clickActive', 'toggleClickActive')"
      :title="getControlMappingName('clickActive')"
      :color="getControlMappingColor('clickActive')"
    >
      <VIcon>{{ mdiMetronome }}</VIcon>
    </VBtn>

    <TextField v-model="clickBpm" />
    <TextField v-model="clickTimeSignature" />

    <Clock
      :values="timeValues"
      @input="setTime"
      :icon="mdiClockOutline"
      class="mr-4"
    />

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
    },
    controlEditMode() {
      return this.$store.state.controlEditMode;
    }
  },
  methods: {
    mapControlOrDispatchAction(controlName, actionName) {
      if (!this.controlEditMode) {
        return this.$store.dispatch(actionName || controlName);
      }

      this.$store.dispatch('setControlEditSelected', controlName);
    },
    getControlMappingName(controlName) {
      if (!this.controlEditMode) {
        return;
      }
      const controlMapping = this.$store.getters.getControlMapping(controlName);
      if (controlMapping) {
        const name =
          {
            ' ': 'Space'
          }[controlMapping.value] || controlMapping.value;
        const type = {
          key: 'Keyboard',
          note: 'Note',
          controlChange: 'Control change'
        }[controlMapping.type];
        return `${type}: ${name}`;
      }
      return '';
    },
    getControlMappingColor(controlName) {
      if (!this.controlEditMode) {
        return;
      }
      const controlMapping = this.$store.getters.getControlMapping(controlName);
      if (controlMapping) {
        return 'yellow';
      }
    },
    setTime(values) {
      const playPosition = values[0] * 60 + values[1] + values[2] / 10;
      this.$store.dispatch('playAt', playPosition);
    }
  }
};
</script>

<style lang="scss" scoped></style>
