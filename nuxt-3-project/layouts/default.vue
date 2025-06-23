<template>
  <div>
    <AppHeader />
      <UContainer >
         <NuxtPage />
      </UContainer>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppHeader from "~/components/AppHeader.vue";
import AppFooter from "~/components/AppFooter.vue";

const nuxtApp = useNuxtApp()
</script>
