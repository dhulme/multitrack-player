<template>
  <VRow>
    <VBtn text icon @click="$store.dispatch('playPause')">
      <VIcon>{{ playPauseIcon }}</VIcon>
    </VBtn>
    <VBtn text icon @click="$store.dispatch('stop')">
      <VIcon>mdi-stop</VIcon>
    </VBtn>

    <VBtn
      :outlined="$store.state.clickActive"
      @click="$store.dispatch('toggleClickActive')"
      >Click</VBtn
    >
    <VTextField :value="$store.state.clickBpm" />

    <Clock />
  </VRow>
</template>

<script>
import Clock from './Clock';

export default {
  components: {
    Clock
  },
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
