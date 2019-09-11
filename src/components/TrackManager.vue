<template>
  <div>
    <VFileInput label="Track" @change="addTrack" />
    <Track
      v-for="track in $store.state.tracks"
      :track="track"
      :key="track.id"
    />
    {{ $store.state.tracks }}
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
