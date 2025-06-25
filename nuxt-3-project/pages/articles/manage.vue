<template>
  <div>
    <div class="my-5">
      <h1 class="text-2xl font-semibold text-center">จัดการบทความ</h1>
    </div>
    <div v-if="loading">กำลังโหลดบทความ...</div>
    <div v-else-if="error">{{ error }}</div>

    <UTable
      v-else
      :columns="columns"
      :data="articles"
      :loading="loading"
      class="flex-1"
    >
    </UTable>
    <UModal
      v-model:open="isDeleteModalOpen"
      title="ยืนยันการลบ"
      :ui="{ footer: 'flex justify-end gap-2' }"
      prevent-close
    >
      <template #body>
        <p class="mb-4">คุณแน่ใจหรือไม่ว่าต้องการลบบทความนี้?</p>
      </template>

      <template #footer>
        <UButton
          color="neutral"
          variant="outline"
          label="ยกเลิก"
          @click="isDeleteModalOpen = false"
        />
        <UButton color="error" label="ลบ" @click="confirmDelete" />
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { UModal, UButton, UBadge } from "#components";
import type { TableColumn } from "@nuxt/ui";
import { useRouter } from "vue-router";
import { useNuxtApp } from "#app";

const supabase = useNuxtApp().$supabase;
const router = useRouter();

interface ArticleListItem {
  id: string;
  title: string | null;
  slug: string | null;
}

const articles = ref<ArticleListItem[]>([]);
const loading = ref(true);
const error = ref("");
const isDeleteModalOpen = ref(false);
const deleteModalId = ref<string | null>(null);

const columns: TableColumn<ArticleListItem>[] = [
  { id: "title", header: "ชื่อบทความ", cell: ({ row }) => row.original.title },
  {
    id: "slug",
    header: "Slug",
    cell: ({ row }) =>
      h(UBadge, {
        class: "capitalize",
        variant: "subtle",
        color: "neutral",
        label: `${row.original.slug}`,
      }),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) =>
      h("div", { class: "flex justify-end gap-2" }, [
        h(
          UButton,
          {
            color: "primary",
            variant: "ghost",
            size: "xs",
            onClick: async () => {
              await router.push(`/articles/edit?id=${row.original.id}`);
            },
          },
          () => "แก้ไข"
        ),
        h(
          UButton,
          {
            color: "error",
            variant: "ghost",
            size: "xs",
            onClick: () => openDeleteModal(row.original.id),
          },
          () => "ลบ"
        ),
      ]),
  },
];

const fetchArticles = async () => {
  loading.value = true;
  const { data, error: fetchError } = await supabase
    .from("articles")
    .select("id, title, slug")
    .order("created_at", { ascending: false });

  if (fetchError) {
    error.value = "โหลดข้อมูลบทความไม่สำเร็จ";
    console.error(fetchError);
  } else {
    articles.value = data || [];
  }
  loading.value = false;
};

const openDeleteModal = (id: string) => {
  deleteModalId.value = id;
  isDeleteModalOpen.value = true;
};

const confirmDelete = async () => {
  if (!deleteModalId.value) return;

  const { data, error: err } = await useFetch(
    `/api/articles/${deleteModalId.value}`,
    {
      method: "DELETE",
    }
  );

  console.log(data.value)

  if (err.value || data.value?.success !== true) {
    console.error("ลบไม่สำเร็จ");
    return;
  } else {
    articles.value = articles.value.filter((a) => a.id !== deleteModalId.value);
  }

  isDeleteModalOpen.value = false;
};

onMounted(fetchArticles);
</script>
