<template>
  <div class="max-w-4xl mx-auto p-6">
    <button
      @click="router.back()"
      class="mb-4 px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
    >
      ← กลับ
    </button>

    <div v-if="loading" class="text-center text-lg">กำลังโหลดบทความ...</div>

    <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>

    <article v-else>
      <h1 class="text-3xl font-bold mb-4">{{ article.title }}</h1>

      <img
        v-if="article.cover_image_url"
        :src="article.cover_image_url"
        alt="ภาพประกอบบทความ"
        class="mb-6 w-full max-h-96 object-cover rounded-lg"
      />
      <div
        class="prose dark:prose-invert max-w-none"
        v-html="article.content"
      ></div>


       <div class="mt-12">
        <h2 class="text-2xl font-semibold mb-4">บทความที่เกี่ยวข้อง</h2>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="related in relatedArticles"
            :key="related.id"
            :to="`/articles/${encodeURIComponent(related.slug)}`"
            class="block p-4 border rounded-xl hover:shadow-md transition bg-white dark:bg-gray-800"
          >
            <img
              v-if="related.cover_image_url"
              :src="related.cover_image_url"
              class="w-full h-32 object-cover rounded mb-2"
              alt="related"
            />
            <p class="text-primary font-medium">{{ related.title }}</p>
          </NuxtLink>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const supabase = useNuxtApp().$supabase;

const route = useRoute();
const router = useRouter();
const relatedArticles = ref([])
const article = ref(null);
const loading = ref(true);
const error = ref("");

const slug = route.params.slug as string;

onMounted(async () => {
  try {
    const { data, error: supabaseError } = await supabase
      .from("articles")
      .select("*")
      .eq("slug", slug)
      .single(); 

    if (supabaseError) throw supabaseError;
    if (!data) {
      error.value = "ไม่พบบทความนี้";
      return;
    }

    article.value = data;

    console.log(data)


  const { data: related, error: relatedError } = await supabase
      .from('articles')
      .select('id, title, slug, cover_image_url')
      .eq('category_id', data.category_id)
      .neq('slug', slug)
      .limit(3)

    if (relatedError) throw relatedError
        relatedArticles.value = related
 console.log(related)
  } catch (err: any) {
    error.value = "เกิดข้อผิดพลาดในการโหลดบทความ";
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped></style>
