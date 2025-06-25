# 🧩 Project Name

A Nuxt 3 web application that provides [คำอธิบายของโปรเจกต์].

---

## 🚀 Getting Started

### ✅ Prerequisites

- Node.js (v18+ recommend)
- npm or yarn
- [Optional] Docker (สำหรับ production หรือ dev environment)

---

### Step 1: Navigate to Project Directory
```bash

cd nuxt-3-project

```

###  Step 2: Install Dependencies

```bash

npm install
# or
yarn install

```

###  Step 3: Setup Environment Variables

```bash

cp .env.example .env


```

#### Example
- NUXT_PUBLIC_SUPABASE_URL= https://your-project.supabase.co
- NUXT_PUBLIC_SUPABASE_KEY= your-anon-key
- NUXT_PUBLIC_USE_MOCK_USER=true


###  Step 4: Run Development Server

```bash

npm run dev
# or
yarn dev

```

- เข้าใช้งานที่: http://localhost:3000



# Features Implemented

- CRUD บทความ (Create, Read, Update, Delete) *ยังทำไม่เสร็จ

- ระบบค้นหาบทความ *ยังไม่ได้ทำ

- SEO Support (SEO title, description) *ทำแล้ว

- ระบบแท็กบทความ *ยังไม่ได้ทำ

- การจัดการหมวดหมู่ *ยังไม่ได้ทำ

- อัปโหลดรูปภาพผ่าน Supabase Storage *ทำได้

- Auth helper (หากมีการใช้งานระบบ Login/Register) *ยังไม่ได้ทำ

# Architecture Decisions
## Project Structure

```bash

.
├── assets/           # Static assets such as SCSS, images, and fonts processed by Nuxt
├── components/       # Reusable UI components (e.g., Button, Card, Navbar)
├── composables/      # Reusable logic and utilities using the Composition API (e.g., useFetch)
├── layouts/          # Application layouts (e.g., default.vue, admin.vue)
├── pages/            # File-based routing system; each .vue file becomes a route
├── plugins/          # Nuxt plugins loaded before rendering (e.g., Supabase, i18n)
├── server/           # Server-side API routes and middleware (Nuxt 3 server engine)
├── public/           # Static files accessible directly via URL (e.g., favicon, robots.txt)
├── stores/           # Global state management (usually with Pinia)
├── utils/            # General utility/helper functions
├── types/            # Shared TypeScript interfaces and type definitions
└── nuxt.config.ts    # Main Nuxt configuration file



```

## State Management
- ใช้ useState ของ Nuxt สำหรับ global states

- ไม่ใช้ Pinia หรือ Vuex เพื่อลดความซับซ้อน (สามารถเพิ่มได้ภายหลัง)

## Supabase Integration

- ใช้ @supabase/supabase-js สำหรับติดต่อฐานข้อมูล

- ใช้ useSupabaseClient() และ useSupabaseUser() ผ่าน plugin