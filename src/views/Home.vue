<template>
  <div class="home">
    <audio :src="publicPath + 'song.mp3'" type="audio/mpeg" ref="audio" />
    <button @click="playPause">Play/pause</button>
    <input type="range" min="0" max="2" step="0.01" v-model="gain" />
    <div ref="test" />
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";
import peaks from "peaks.js";

const audioContext = new AudioContext();
const gainNode = audioContext.createGain();

export default {
  name: "home",
  data() {
    return {
      publicPath: process.env.BASE_URL,
      gain: 1
    };
  },
  mounted() {
    console.log(this.$refs.audio);
    const track = audioContext.createMediaElementSource(this.$refs.audio);
    track.connect(gainNode).connect(audioContext.destination);
    peaks.init({
      containers: {
        overview: this.$refs.test
      },
      mediaElement: this.$refs.audio,
      audioContext,
      height: 100
    });
  },
  methods: {
    playPause() {
      if (audioContext.state === "suspended") {
        audioContext.resume();
      }
      this.$refs.audio.play();
    }
  },
  watch: {
    gain(value) {
      gainNode.gain.value = value;
    }
  }
};
</script>
