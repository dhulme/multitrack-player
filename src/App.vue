<template>
  <div>
    <VProgressLinear v-if="$store.state.loading" indeterminate />
    <VApp v-else>
      <VAppBar height="auto" class="app-bar">
        <v-toolbar-title class="headline d-none d-md-flex">
          Multitrack Player
        </v-toolbar-title>
        <Controls />
      </VAppBar>

      <v-content>
        <router-view />
      </v-content>
    </VApp>
  </div>
</template>

<script>
import Controls from '@/components/Controls';

import { initClick } from './click';
import { initMidi } from './midi';
import { initKeyEvents } from './key';
import store from '@/store';

export default {
  components: {
    Controls
  },
  async mounted() {
    try {
      await Promise.all([initMidi(store), initClick()]);
      this.$store.commit('setMidiSupported', true);
    } catch (error) {
      console.error('MIDI initialization failed:', error);
      this.$store.commit('setMidiSupported', false);
    }
    await this.$store.dispatch('checkMidiSupport');
    await this.$store.dispatch('initSettings');
    initKeyEvents(this.$store);

    this.$store.commit('setLoading', false);
  },
  watch: {
    '$store.state.controlEditMode'(value) {
      this.$vuetify.theme.dark = !!value;
    }
  }
};
</script>

<style lang="scss" scoped>
.app-bar {
  flex-grow: 0;
}
</style>
