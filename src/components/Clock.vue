<template>
  <VRow class="text-center container">
    <VCol cols="3">{{ minutes }}</VCol>
    <VCol cols="1">:</VCol>
    <VCol cols="3">{{ seconds }}</VCol>
    <VCol cols="1">:</VCol>
    <VCol cols="3">{{ milliseconds }}</VCol>
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

<style lang="scss" scoped>
.container {
  max-width: 15rem;
  min-width: 15rem;
  user-select: none;

  & > div {
    padding: 0;
  }
}
</style>
