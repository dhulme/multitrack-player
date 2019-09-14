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
export default {
  data() {
    return {
      outputs: [
        { text: '1/2 (Stereo)', value: 0 },
        { text: '1 (Mono)', value: -1 },
        { text: '2 (Mono)', value: 1 }
      ]
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
        return this.$store.state.trackPanning;
      },
      set(value) {
        return this.$store.dispatch('setTrackPanning', value);
      }
    },
    clickPanning: {
      get() {
        return this.$store.state.clickPanning;
      },
      set(value) {
        return this.$store.dispatch('setClickPanning', value);
      }
    }
  }
};
</script>
