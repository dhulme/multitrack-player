<template>
  <v-row>
    <v-btn text icon @click="$store.dispatch('playPause')">
      <v-icon>{{ playPauseIcon }}</v-icon>
    </v-btn>
    <v-btn text icon @click="$store.dispatch('stop')">
      <v-icon>mdi-stop</v-icon>
    </v-btn>

    <!-- <VBtn :outline="$store.state.clickActive" @click="$store.dispatch('toggleClickActive')">Click</VBtn> -->
    <VTextField :value="$store.state.clickBpm" />
  </v-row>
</template>

<script>
export default {
  methods: {},
  computed: {
    playPauseIcon() {
      return {
        playing: 'mdi-pause',
        paused: 'mdi-play',
        stopped: 'mdi-play'
      }[this.$store.state.playState];
    }
  }
};
</script>
