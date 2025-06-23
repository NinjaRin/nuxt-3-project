<template>
 <footer class="bg-gray-900 dark:bg-gray-950 text-gray-300 dark:text-gray-400">
  <div class="border-t border-gray-700 dark:border-gray-800 mt-10 py-4 text-center text-sm">
    © {{ year }} {{ site.name }}. All rights reserved.
  </div>
</footer>
</template>

<script setup lang="ts">
const site = siteSetup();

const year = new Date().getFullYear();
</script>
