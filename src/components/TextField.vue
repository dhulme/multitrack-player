<template>
  <VTextField
    class="input-thin"
    single-line
    hide-details
    v-model="localValue"
    @keyup.enter="set"
    ref="textField"
  />
</template>

<script>
export default {
  props: ['value'],
  data() {
    return {
      localValue: this.value
    };
  },
  watch: {
    value(value) {
      if (document.activeElement !== this.$refs.textField.$refs.input) {
        this.localValue = value;
      }
    }
  },
  methods: {
    set() {
      this.$emit('input', this.localValue);
      this.$refs.textField.blur();
    }
  }
};
</script>

<style lang="scss">
.input-thin {
  margin: 0 0.5rem;
}
.input-thin input {
  text-align: center;
}
</style>
