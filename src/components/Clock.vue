<template>
  <VRow class="text-center container">
    <div>{{ title }}</div>
    <template v-for="(value, index) in values">
      <VCol cols="3" :key="'value' + index">{{ value }}</VCol>
      <VCol v-if="index < values.length" cols="1" :key="'spacer' + index"
        >:</VCol
      >
    </template>
  </VRow>
</template>

<script>
export default {
  props: {
    values: Array,
    title: String
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
