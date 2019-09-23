<template>
  <VContainer>
    <SettingsDialog />
    <AboutDialog />
    <TrackManager />
  </VContainer>
</template>

<script>
import TrackManager from '@/components/TrackManager';
import SettingsDialog from '@/components/SettingsDialog';
import AboutDialog from '@/components/AboutDialog';

export default {
  components: {
    TrackManager,
    SettingsDialog,
    AboutDialog
  },
  name: 'home',
  data() {
    return {
      publicPath: process.env.BASE_URL
    };
  }
};
</script>
