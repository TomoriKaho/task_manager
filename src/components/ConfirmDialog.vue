<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { AlertTriangle, X } from 'lucide-vue-next'

defineProps<{ title: string }>()
const emit = defineEmits<{ confirm: []; close: [] }>()
const dialog = ref<HTMLDialogElement | null>(null)

onMounted(() => dialog.value?.showModal())

function confirm() {
  emit('confirm')
}
</script>

<template>
  <dialog ref="dialog" class="task-dialog confirm-dialog" aria-labelledby="confirm-title" @close="emit('close')">
    <div class="dialog-content">
      <div class="confirm-icon"><AlertTriangle :size="21" /></div>
      <button class="icon-button confirm-close" type="button" aria-label="关闭弹窗" @click="dialog?.close()"><X :size="19" /></button>
      <h2 id="confirm-title" class="dialog-title">删除这项任务？</h2>
      <p class="dialog-subtitle">“{{ title }}”将被永久删除，此操作无法撤销。</p>
      <div class="dialog-actions">
        <button class="button-secondary" type="button" @click="dialog?.close()">取消</button>
        <button class="button-danger" type="button" @click="confirm">确认删除</button>
      </div>
    </div>
  </dialog>
</template>
