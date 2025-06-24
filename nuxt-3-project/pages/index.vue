<template>
  <UContainer class="space-y-16 py-12">
    <section class="text-center">
      <h1 class="text-4xl font-bold tracking-tight sm:text-6xl">
        สร้างเว็บของคุณด้วย Nuxt
      </h1>
      <p class="mt-6 text-lg leading-8 text-gray-500 dark:text-gray-400">
        Nuxt JS และ Nuxt UI
        ช่วยให้คุณพัฒนาเว็บไซต์ได้อย่างรวดเร็วและมีประสิทธิภาพ
      </p>
      <div class="mt-10 flex justify-center gap-x-6">
        <UButton size="lg">เริ่มต้นใช้งาน</UButton>
        <UButton variant="ghost" size="lg">ดูตัวอย่าง</UButton>
      </div>
    </section>
    <section>
      <h2 class="text-2xl font-semibold text-center mb-10">จุดเด่นของเรา</h2>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <UCard class="text-center">
          <template #header>⚡️ เร็วสุดๆ</template>
          โหลดไว รองรับ SEO เต็มรูปแบบ
        </UCard>
        <UCard class="text-center">
          <template #header>🎨 ดีไซน์ทันสมัย</template>
          รองรับ Dark Mode และ Responsive
        </UCard>
        <UCard class="text-center">
          <template #header>🛠 ใช้งานง่าย</template>
          พัฒนาได้เร็วด้วย Nuxt UI Components
        </UCard>
      </div>
    </section>
    <section>
      <h2 class="text-2xl font-semibold text-center mb-10">เสียงจากผู้ใช้</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <UCard>
          <template #header>🌟 ผู้ใช้ A</template>
          ใช้งาน Nuxt แล้วชีวิตง่ายขึ้นมาก! โหลดไว ตอบสนองดี
        </UCard>
        <UCard>
          <template #header>💬 ผู้ใช้ B</template>
          ชอบที่มี Component ให้พร้อมใช้ ไม่ต้องเขียน CSS เองเลย
        </UCard>
        <UCard>
          <template #header>🚀 ผู้ใช้ C</template>
          รองรับ Dark Mode ด้วย ประทับใจสุดๆ
        </UCard>
      </div>
    </section>
  </UContainer>
</template>

<script setup></script>

<style scoped></style>
