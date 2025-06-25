<template>
  <ClientOnly>
    <div>
      <textarea :id="editorId"></textarea>
    </div>
  </ClientOnly>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'

const props = defineProps({
  modelValue: String,
  id: {
    type: String,
    default: () => `tinymce-${Math.floor(Math.random() * 10000)}`
  }
})
const emit = defineEmits(['update:modelValue'])

const editorId = ref(props.id)

onMounted(async () => {
  if (!process.client) return

  await import('tinymce')
  await import('tinymce/icons/default')
  await import('tinymce/themes/silver')
  await import('tinymce/plugins/link')
  await import('tinymce/plugins/table')
  await import('tinymce/plugins/lists')
  await import('tinymce/plugins/code')
  window.tinymce.init({
    selector: `#${editorId.value}`,
    height: 300,
    menubar: false,
    plugins: 'link table lists code',
    toolbar: 'undo redo | bold italic underline | bullist numlist | link table | code',
    setup(editor) {
      editor.on('init', () => {
        editor.setContent(props.modelValue || '')
      })
      editor.on('Change KeyUp', () => {
        emit('update:modelValue', editor.getContent())
      })
    }
  })
})

onBeforeUnmount(() => {
  if (!process.client) return
  const existingEditor = window.tinymce?.get(editorId.value)
  if (existingEditor) {
    existingEditor.remove()
  }
})
</script>
