<template>
  <div>
    <VFileInput label="Track" @change="addTrack" :value="files" multiple />
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
    addTrack(files) {
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
