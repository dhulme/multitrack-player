<template>
  <VDialog v-model="dialog" max-width="400">
    <VCard>
      <VCardTitle>Settings</VCardTitle>
      <VCardText>
        <VForm>
          <VSelect
            :items="outputs"
            v-model="trackPanning"
            label="Track output"
          />
          <VSelect
            :items="outputs"
            v-model="clickPanning"
            label="Click output"
          />

          <VSlider
            label="Track volume"
            hide-details
            v-model="trackGain"
            min="0"
            max="2"
            step="0.01"
          />

          <VSlider
            label="Click volume"
            v-model="clickGain"
            min="0"
            max="2"
            step="0.01"
          />

          <VSelect
            :items="midiDevices"
            label="MIDI Control Device"
            v-model="midiDevice"
          />

          <VLabel>Edit MIDI and key mapping</VLabel>
          <VRow class="mt-2 ml-1">
            <VBtn
              class="mr-4"
              small
              outlined
              @click="$store.dispatch('toggleControlEditMode')"
              >MIDI</VBtn
            >
            <VBtn
              small
              outlined
              @click="$store.dispatch('toggleControlEditMode')"
              >Key</VBtn
            >
          </VRow>
        </VForm>
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn text @click="dialog = false" color="primary">OK</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script>
import { inputs } from '../midi';

export default {
  data() {
    return {
      outputs: [
        { text: '1/2 (Stereo)', value: 0 },
        { text: '1 (Mono)', value: -1 },
        { text: '2 (Mono)', value: 1 }
      ],
      midiDevices: inputs().map(input => input.name)
    };
  },
  computed: {
    dialog: {
      get() {
        return this.$store.state.dialog === 'settings';
      },
      set() {
        return this.$store.dispatch('toggleSettingsDialog');
      }
    },
    trackPanning: {
      get() {
        return this.$store.state.settings.trackPanning;
      },
      set(value) {
        return this.$store.dispatch('setTrackPanning', value);
      }
    },
    clickPanning: {
      get() {
        return this.$store.state.settings.clickPanning;
      },
      set(value) {
        return this.$store.dispatch('setClickPanning', value);
      }
    },
    clickGain: {
      get() {
        return this.$store.state.settings.clickGainValue;
      },
      set(value) {
        this.$store.dispatch('setClickGainValue', value);
      }
    },
    trackGain: {
      get() {
        return this.$store.state.settings.trackGainValue;
      },
      set(value) {
        this.$store.dispatch('setMasterTrackGainValue', value);
      }
    },
    midiDevice: {
      get() {
        return this.$store.state.settings.midiDeviceName;
      },
      set(value) {
        this.$store.dispatch('setMidiDeviceName', value);
      }
    }
  }
};
</script>
