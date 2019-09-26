<template>
  <span class="text-center clock-container">
    <VIcon>{{ icon }}</VIcon>
    <template v-for="(value, index) in values">
      <div class="value" :key="'value' + index">{{ value }}</div>
      <div
        class="spacer"
        v-if="index < values.length - 1"
        :key="'spacer' + index"
      >
        :
      </div>
    </template>
  </span>
</template>

<script>
export default {
  props: {
    values: Array,
    icon: Object
  }
};
</script>

<style lang="scss" scoped>
.clock-container {
  user-select: none;
  flex-grow: 0;

  .value {
    width: 2rem;
    display: inline-block;
  }

  .spacer {
    width: 0.25rem;
    display: inline-block;
  }
}
</style>
