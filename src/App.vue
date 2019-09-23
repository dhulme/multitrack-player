<template>
  <div>
    <VProgressLinear v-if="$store.state.loading" indeterminate />
    <VApp v-else>
      <VAppBar app>
        <v-toolbar-title class="headline">
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

export default {
  components: {
    Controls
  }
};
</script>
