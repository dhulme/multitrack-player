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

export default {
  components: {
    Controls
  },
  async mounted() {
    await Promise.all([initMidi(), initClick()]);
    this.$store.commit('setLoading', false);
  }
};
</script>

<style lang="scss" scoped>
.app-bar {
  flex-grow: 0;
}
</style>
