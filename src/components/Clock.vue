<template>
  <span class="text-center clock-container">
    <VIcon>{{ icon }}</VIcon>
    <template v-for="(value, index) in values">
      <TextField
        class="value"
        :key="'value' + index"
        :value="value"
        @input="set($event, index)"
      />
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
import TextField from './TextField';

export default {
  components: {
    TextField
  },
  props: {
    values: Array,
    icon: String
  },
  methods: {
    set(value, index) {
      const values = [...this.values];
      values[index] = Number(value);
      this.$emit('input', { values, index });
    }
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
