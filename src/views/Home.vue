<template>
  <div>
    <Controls />
    <TrackManager />
  </div>
</template>

<script>
import Controls from '@/components/Controls';
import TrackManager from '@/components/TrackManager';
// @ is an alias to /src
// const audioContext = new AudioContext();
// const gainNode = audioContext.createGain();

export default {
  components: {
    Controls,
    TrackManager
  },
  name: 'home',
  data() {
    return {
      publicPath: process.env.BASE_URL
    };
  },
  mounted() {
    // console.log(this.$refs.audio);
    // const track = audioContext.createMediaElementSource(this.$refs.audio);
    // track.connect(gainNode).connect(audioContext.destination);
  },
  methods: {
    playPause() {
      // if (audioContext.state === 'suspended') {
      //   audioContext.resume();
      // }
      this.$refs.audio.play();
    }
  },
  watch: {
    gain() {
      // gainNode.gain.value = value;
    }
  }
};
</script>
