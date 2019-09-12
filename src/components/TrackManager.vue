<template>
  <div>
    <VFileInput label="Track" @change="addTrack" />
    <Track
      v-for="(track, index) in $store.state.tracks"
      :track="track"
      :number="index + 1"
      :key="track.id"
    />
  </div>
</template>

<script>
import Track from './Track';

export default {
  components: {
    Track
  },
  methods: {
    addTrack(file) {
      const fileReader = new FileReader();
      fileReader.addEventListener('load', () => {
        this.$store.dispatch('addTrack', fileReader.result);
      });
      fileReader.readAsArrayBuffer(file);
    }
  }
};
</script>
