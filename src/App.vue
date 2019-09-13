<template>
  <VApp>
    <VAppBar app>
      <v-toolbar-title class="headline">
        Multitrack Player
      </v-toolbar-title>
      <VSpacer />
      <Controls />
    </VAppBar>

    <v-content>
      <router-view />
    </v-content>
  </VApp>
</template>

<script>
import Controls from '@/components/Controls';

export default {
  components: {
    Controls
  }
};
</script>
