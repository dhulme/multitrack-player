<template>
  <div>
    <VFileInput
      label="Tracks"
      @change="addTracks"
      :value="files"
      multiple
      placeholder="Add audio files"
    />
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
  data() {
    return {
      files: []
    };
  },
  methods: {
    addTracks(files) {
      if (!files.length) {
        return;
      }

      files.forEach(file => {
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);
        fileReader.addEventListener('load', () => {
          this.$store.dispatch('addTrack', fileReader.result);
        });
      });
      this.files = [];
    }
  }
};
</script>
