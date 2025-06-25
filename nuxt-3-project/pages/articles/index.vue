<template>
  <div>
    <div class="my-5">
      <h1 class="text-2xl font-semibold text-center">บทความ</h1>
    </div>

    <div class="my-3 flex justify-end gap-2">
      <UButton color="success" to="/articles/create">เพิ่มบทความ</UButton>
      <UButton color="warning" to="/articles/manage">จัดการบทความ</UButton>
    </div>

    <div v-if="loading" class="text-center">กำลังโหลดข้อมูล...</div>
    <div v-else-if="articles.length === 0" class="text-center">ไม่พบบทความ</div>

    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="article in articles"
        :key="article.id"
        class="p-4 border rounded-xl shadow hover:shadow-md bg-white dark:bg-gray-800 transition"
      >
        <NuxtLink
          :to="`/articles/${encodeURIComponent(article.slug)}`"
          class="block space-y-2"
        >
          <img
            :src="article.cover_image_url || '/placeholder.jpg'"
            alt="article image"
            class="w-full h-48 object-cover rounded-lg"
          />

          <h2 class="text-xl font-semibold text-primary">
            {{ article.title }}
          </h2>
          <p class="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
            {{ stripHtml(article.content) }}
          </p>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { stripHtml } from "~/utils/stripHtml";
const supabase = useNuxtApp().$supabase;

const articles = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    articles.value = data;
  } catch (err) {
    console.error("Error loading articles:", err);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped></style>
