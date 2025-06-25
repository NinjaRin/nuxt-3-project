<template>
  <div class="max-w-5xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">จัดการบทความ</h1>

    <div v-if="loading" class="text-center">กำลังโหลดบทความ...</div>
    <div v-else-if="error" class="text-red-500 text-center">{{ error }}</div>

    <table v-else class="w-full table-auto border-collapse">
      <thead>
        <tr class="bg-gray-100 dark:bg-gray-800">
          <th class="p-2 text-left border">#</th>
          <th class="p-2 text-left border">ชื่อบทความ</th>
          <th class="p-2 text-left border w">Slug</th>
          <th class="p-2 text-center border">จัดการ</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(article, index) in articles" :key="article.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
          <td class="p-2 border">{{ index + 1 }}</td>
          <td class="p-2 border">{{ article.title }}</td>
          <td class="p-2 border text-sm text-gray-500 w-300 truncate">{{ article.slug }}</td>
          <td class="p-2 border text-center space-x-2">
            <NuxtLink
              :to="`/articles/edit?id=${article.id}`"
              class="text-blue-600 hover:underline"
            >
              แก้ไข
            </NuxtLink>
            <button
              @click="confirmDelete(article.id)"
              class="text-red-600 hover:underline"
            >
              ลบ
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const supabase = useNuxtApp().$supabase
const router = useRouter()

interface ArticleListItem {
  id: number
  title: string
  slug: string
}

const articles = ref<ArticleListItem[]>([])
const loading = ref(true)
const error = ref('')

const fetchArticles = async () => {
  loading.value = true
  const { data, error: fetchError } = await supabase
    .from('articles')
    .select('id, title, slug')
    .order('created_at', { ascending: false })

  if (fetchError) {
    error.value = 'โหลดข้อมูลบทความไม่สำเร็จ'
    console.error(fetchError)
  } else {
    articles.value = data || []
  }

  loading.value = false
}

const confirmDelete = async (id: number) => {
  const confirmed = window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบบทความนี้?')
  if (!confirmed) return

  const { error: deleteError } = await supabase
    .from('articles')
    .delete()
    .eq('id', id)

  if (deleteError) {
    alert('เกิดข้อผิดพลาดในการลบ')
    console.error(deleteError)
  } else {
    articles.value = articles.value.filter(article => article.id !== id)
  }
}

onMounted(fetchArticles)
</script>
