<template>
  <div class="max-w-4xl mx-auto py-10 px-4">
    <div>
      <div class="my-2">
        <h1 class="text-2xl font-semibold">สร้างบทความใหม่</h1>
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
                v-model="form.category"
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
            บันทึกบทความ
          </UButton>
        </div>
      </UForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, onUnmounted } from "vue";
import type { Category } from "~/types/category";
import type { Tags } from "~/types/category";
import { createSlug } from "~/utils/createSlug";

const supabase = useNuxtApp().$supabase;

const form = reactive({
  title: "",
  content: "",
  category: "",
  tags: [] as string[],
  seoTitle: "",
  seoDescription: "",
  imageFile: null,
});

const category = ref<{ label: string; value: string }[]>([]);
const tags = ref<{ label: string; value: string }[]>([]);

async function fetchCategories() {
  const { data, error } = await supabase.from("categories").select();

  if (error) {
    console.error("Error fetching categories:", error);
    return;
  }

  category.value = (data as Category[])
    .filter((item): item is Category => Boolean(item.name))
    .map((item) => ({
      label: item.name,
      value: item.id,
    }));
}

async function fetchTags() {
  const { data, error } = await supabase.from("tags").select();

  if (error) {
    console.error("Error fetching tags:", error);
    return;
  }

  tags.value = (data as Tags[])
    .filter((item): item is Tags => Boolean(item.name))
    .map((item) => ({
      label: item.name,
      value: item.id,
    }));
}

//const tags = ["Vue", "Nuxt", "SEO", "JavaScript", "CSS"];

const previewUrl = ref<string | null>(null);
const lastSaved = ref<string | null>(null);
const uploading = ref(false);

function onFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  previewUrl.value = URL.createObjectURL(file);
  form.imageFile = file;
}

function saveDraft() {
  console.log("💾 บันทึกฉบับร่าง", { ...form });
  lastSaved.value = new Date().toLocaleTimeString();
}

let draftInterval: any = null;

onMounted(() => {
  draftInterval = setInterval(saveDraft, 20000);
});

onUnmounted(() => {
  clearInterval(draftInterval);
});

onMounted(() => {
  fetchCategories();
  fetchTags();
});

async function submitArticle() {
  if (!form.title || !form.content) {
    return alert("กรุณากรอกหัวข้อและเนื้อหา");
  }

  await submitForm();
}


async function submitForm() {
  uploading.value = true;

  const supabase = useNuxtApp().$supabase;

  let imagePath: string | null = null;

  if (form.imageFile) {
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("article-images")
      .upload(`public/${Date.now()}-${form.imageFile.name}`, form.imageFile);

    if (uploadError) {
      console.error("❌ Upload Error:", uploadError);
      uploading.value = false;
      return;
    }

    imagePath = uploadData?.path ?? null;
  }

  const imageUrl = imagePath
    ? supabase.storage.from("article-images").getPublicUrl(imagePath).data
        .publicUrl
    : null;

  const { data: article, error: insertError } = await supabase
    .from("articles")
    .insert([
      {
        title: form.title,
        slug: createSlug(form.title),
        content: form.content,
        category_id: form.category,
        seo_title: form.seoTitle,
        seo_description: form.seoDescription,
        cover_image_url: imageUrl,
      },
    ])
    .select("id")
    .single();

  if (article && form.tags.length) {
    const articleTags = form.tags.map((tagId) => ({
      article_id: article.id,
      tag_id: tagId,
    }));

    const { error: tagError } = await supabase
      .from("article_tags")
      .insert(articleTags);
  }

  uploading.value = false;

  if (insertError) {
    console.error("❌ Insert error:", insertError);
  } else {
    console.log("✅ บันทึกบทความสำเร็จ", article);
  }
}
</script>
