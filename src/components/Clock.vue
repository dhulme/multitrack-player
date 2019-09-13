<template>
  <VRow>
    <VCol>{{ minutes }}</VCol>
    <VCol>:</VCol>
    <VCol>{{ seconds }}</VCol>
    <VCol>:</VCol>
    <VCol>{{ milliseconds }}</VCol>
  </VRow>
</template>

<script>
export default {
  computed: {
    playPosition() {
      return this.$store.state.playPosition;
    },
    minutes() {
      return Math.floor(this.playPosition / 60);
    },
    seconds() {
      return Math.floor(this.playPosition % 60);
    },
    milliseconds() {
      return Math.floor((this.playPosition % 1) * 10);
    }
  }
};
</script>
