<template>
  <VTextField
    class="input-thin"
    single-line
    hide-details
    v-model="localValue"
    @keyup.enter="$emit('input', localValue)"
  />
</template>

<script>
export default {
  props: ['values'],
  data() {
    return {
      localValue: ''
    };
  },
  watch: {
    value(value) {
      this.value = value;
    }
  }
};
</script>

<style lang="scss">
.input-thin {
  max-width: 4rem;
  margin: 0 0.5rem;
}
.input-thin input {
  text-align: center;
}
</style>
