<template>
  <div>
  <UModal
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    prevent-close
    title="ยืนยันการลบ"
    :ui="{ footer: 'flex justify-end gap-2' }"
  >
  
    <template #body>
      <p class="mb-4">คุณแน่ใจหรือไม่ว่าต้องการลบบทความนี้?</p>
    </template>

    <template #footer>
      <UButton
        color='neutral'
        variant="outline"
        label="ยกเลิก"
        @click="emit('update:modelValue', false)"
      />
      <UButton
        color='error'
        label="ลบ"
        @click="confirm"
      />
    </template>
  </UModal>
  </div>
</template>

<script setup lang="ts">
import { UModal, UButton } from '#components'

const props = defineProps<{
  modelValue: boolean
  id: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm', id: string): void
}>()

const confirm = () => {
  emit('confirm', props.id)
  emit('update:modelValue', false)
}
</script>
