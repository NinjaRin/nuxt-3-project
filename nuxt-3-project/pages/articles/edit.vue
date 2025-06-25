<template>
  <div class="max-w-4xl mx-auto py-10 px-4">
    <div>
      <div class="my-2">
        <h1 class="text-2xl font-semibold">แก้ไขบทความ</h1>
      </div>

      <UForm :state="form" @submit="submitArticle">
        <UFormField label="หัวข้อบทความ" name="title" required>
          <UInput
            v-model="form.title"
            class="w-full"
            placeholder="เช่น วิธีปลูกต้นไม้ในคอนโด"
          />
        </UFormField>

        <UFormField label="เนื้อหา" name="content" class="mt-4">
          <ClientOnly>
            <TinyMCEEditor v-model="form.content" />
          </ClientOnly>
        </UFormField>

        <div class="flex my-2 gap-2">
          <div class="w-1/2">
            <UFormField label="หมวดหมู่" name="category" class="mt-4">
              <USelect
                v-model="categoryValue"
                :items="category"
                placeholder="เลือกหมวดหมู่"
                class="w-full"
              />
            </UFormField>
          </div>

          <div class="w-1/2">
            <UFormField label="แท็ก" name="tags" class="mt-4">
              <USelectMenu
                v-model="form.tags"
                :items="tags"
                multiple
                placeholder="เลือกแท็ก"
                class="w-full"
              />
            </UFormField>
          </div>
        </div>

        <UFormField label="SEO Title" name="seoTitle" class="mt-4">
          <UInput
            class="w-full"
            v-model="form.seoTitle"
            placeholder="เช่น วิธีปลูกต้นไม้ในคอนโด | MySite"
          />
        </UFormField>

        <UFormField label="SEO Description" name="seoDescription" class="mt-4">
          <UTextarea
            class="w-full"
            v-model="form.seoDescription"
            placeholder="คำอธิบายย่อสำหรับ SEO"
          />
        </UFormField>

        <UFormField label="รูปภาพประกอบ" name="image" class="mt-4">
          <UInput
            type="file"
            accept="image/*"
            @change="onFileChange"
            class="block text-sm"
          />
          <div v-if="previewUrl" class="mt-2">
            <img
              :src="previewUrl"
              alt="Preview"
              class="max-w-[200px] max-h-[200px] rounded border"
            />
          </div>
        </UFormField>

        <div class="mt-6 flex justify-end">
          <UButton type="submit" color="primary" variant="solid">
            บันทึกการเปลี่ยนแปลง
          </UButton>
        </div>
      </UForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const supabase = useNuxtApp().$supabase;

const id = route.query.id as string | undefined;

interface ArticleForm {
  title: string;
  content: string | undefined;
  category: string | null | undefined;
  tags: { label: string; value: string }[];
  seoTitle: string;
  seoDescription: string;
  image: File | null;
  cover_image_url: string;
}
const categoryValue = computed({
  get: () => form.value.category ?? undefined,
  set: (val) => (form.value.category = val),
});

const previewUrl = ref<string | null>(null);
const category = ref<{ label: string; value: string }[]>([]);
const tags = ref<{ label: string; value: string }[]>([]);
const loading = ref(true);
const error = ref("");

const fetchData = async () => {
  if (!id) {
    error.value = "ไม่พบรหัสบทความ";
    return;
  }

  const { data, error: fetchError } = await supabase
    .from("articles")
    .select(
      "id, title, content, category_id, seo_title, seo_description, cover_image_url"
    )
    .eq("id", id)
    .single();

  if (fetchError || !data) {
    error.value = "ไม่สามารถโหลดบทความได้";
    console.error(fetchError);
    return;
  }

  const { data: tagLinks, error: tagLinkError } = await supabase
    .from("article_tags")
    .select("tag_id")
    .eq("article_id", id);

  const tagIds = tagLinks?.map((link) => link.tag_id) ?? [];

  const { data: tagItems, error: tagItemsError } = await supabase
    .from("tags")
    .select("id, name")
    .in("id", tagIds);

  const selectedTags =
    tagItems?.map((t) => ({ label: t.name, value: t.id })) ?? [];

  form.value = {
    title: data.title,
    content: data.content,
    category: data.category_id,
    tags: selectedTags,
    seoTitle: data.seo_title || "",
    seoDescription: data.seo_description || "",
    image: null,
    cover_image_url: data.cover_image_url || "",
  };

  previewUrl.value = data.cover_image_url || "";
};

const form = ref<ArticleForm>({
  title: "",
  content: "",
  category: undefined,
  tags: [],
  seoTitle: "",
  seoDescription: "",
  image: null,
  cover_image_url: "",
});







const fetchCategoriesAndTags = async () => {
  const { data: categoriesData } = await supabase
    .from("categories")
    .select("id, name");

  category.value =
    categoriesData?.map((c: any) => ({ label: c.name, value: c.id })) ?? [];

  const { data: tagsData } = await supabase.from("tags").select("id, name");
  tags.value =
    tagsData?.map((t: any) => ({ label: t.name, value: t.id })) ?? [];
};

onMounted(async () => {
  await Promise.all([fetchData(), fetchCategoriesAndTags()]);
  loading.value = false;
});

const onFileChange = async (event: Event) => {
  const file = (event.target as HTMLInputElement)?.files?.[0];
  if (!file) return;

  form.value.image = file;
  previewUrl.value = URL.createObjectURL(file);
};

const uploadImage = async (file: File) => {
  const fileName = `${Date.now()}-${file.name}`;
  const { data, error: uploadError } = await supabase.storage
    .from("article-images")
    .upload(`public/${fileName}`, file);

  if (uploadError) throw uploadError;

  const {
    data: { publicUrl },
  } = supabase.storage.from("article-images").getPublicUrl(data.path);
  return publicUrl;
};

const submitArticle = async () => {
  let imageUrl = form.value.cover_image_url;

  if (form.value.image) {
    imageUrl = await uploadImage(form.value.image);
  }

  const { error: updateError } = await supabase
    .from("articles")
    .update({
      title: form.value.title,
      content: form.value.content,
      cover_image_url: imageUrl,
      category_id: form.value.category ?? null,
      seo_title: form.value.seoTitle,
      seo_description: form.value.seoDescription,
    })
    .eq("id", id);

  await supabase.from("article_tags").delete().eq("article_id", id);

  const newTagLinks = form.value.tags.map((tag) => ({
    article_id: id,
    tag_id: tag.value,
  }));

  if (newTagLinks.length > 0) {
    const { error: tagInsertError } = await supabase
      .from("article_tags")
      .insert(newTagLinks);

    if (updateError || tagInsertError) {
      alert("เกิดข้อผิดพลาดในการบันทึก");
      console.error(updateError, tagInsertError);
      return;
    }
  }

  router.push("/articles/manage");
};
</script>
