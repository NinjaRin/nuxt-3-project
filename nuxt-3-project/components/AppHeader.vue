<template>
  <header
    class="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 text-gray-800 dark:text-gray-100"
  >
    <div class="container mx-auto px-4 py-3 flex items-center justify-between">
      <NuxtLink
        to="/"
        class="text-2xl font-bold text-blue-600 dark:text-blue-400"
      >
        {{ site.name }}
      </NuxtLink>

      <div class="flex items-center justify-end">
        <nav class="hidden md:flex space-x-6">
          <NuxtLink to="/" class="hover:text-blue-600 dark:hover:text-blue-400"
            >Home</NuxtLink
          >
          <NuxtLink
            to="/calculator"
            class="hover:text-blue-600 dark:hover:text-blue-400"
            >Calculator</NuxtLink
          >
          <NuxtLink
            to="/comparison"
            class="hover:text-blue-600 dark:hover:text-blue-400"
            >Comparison</NuxtLink
          >
          <NuxtLink
            to="/articles"
            class="hover:text-blue-600 dark:hover:text-blue-400"
            >Articles</NuxtLink
          >
        </nav>

        <ColorModeButton class="mx-2 cursor-pointer" />
        <button
          @click="toggleMobileMenu"
          class="md:hidden text-gray-600 dark:text-gray-300 focus:outline-none"
        >
          <IconMenu />
        </button>
      </div>
    </div>

    <div
      v-if="mobileMenuOpen"
      class="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-700"
    >
      <div class="px-4 py-2 space-y-2">
        <NuxtLink
          to="/"
          class="block hover:text-blue-600 dark:hover:text-blue-400"
          >Home</NuxtLink
        >
        <NuxtLink
          to="/calculator"
          class="block hover:text-blue-600 dark:hover:text-blue-400"
          >Calculator</NuxtLink
        >
        <NuxtLink
          to="/comparison"
          class="block hover:text-blue-600 dark:hover:text-blue-400"
          >Comparison</NuxtLink
        >
        <NuxtLink
          to="/articles"
          class="hover:text-blue-600 dark:hover:text-blue-400"
          >Articles</NuxtLink
        >
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ColorModeButton from "@/components/ColorModeButton.vue";
import IconMenu from "@/components/IconMenu.vue";
const site = siteSetup();

const mobileMenuOpen = ref(false);
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};
</script>
