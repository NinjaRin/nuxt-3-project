import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  app: {
    head: {
      script: [
        {
          src: "https://cdn.tiny.cloud/1/no-api-key/tinymce/6/tinymce.min.js",
          defer: true,
        },
      ],
    },
  },
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ["tinymce", "tinymce/themes/silver", "tinymce/icons/default"],
    },
  },
  css: ["~/assets/css/main.css"],
  ui: {
    colorMode: true,
  },
  modules: ["@nuxt/ui", "@pinia/nuxt"],
  runtimeConfig: {
    supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NUXT_PUBLIC_SUPABASE_KEY,
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NUXT_PUBLIC_SUPABASE_KEY,
    },
  },
});
