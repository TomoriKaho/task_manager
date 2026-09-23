<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { X } from 'lucide-vue-next'
import { validateTitle } from '../lib/tasks'
import { PRIORITIES, STATUSES, priorityLabel, statusLabel, type Task, type TaskInput, type TaskStatus } from '../types/task'

const props = defineProps<{ task: Task | null; initialStatus: TaskStatus }>()
const emit = defineEmits<{ save: [input: TaskInput]; close: [] }>()

const dialog = ref<HTMLDialogElement | null>(null)
const titleInput = ref<HTMLInputElement | null>(null)
const title = ref(props.task?.title ?? '')
const description = ref(props.task?.description ?? '')
const status = ref<TaskStatus>(props.task?.status ?? props.initialStatus)
const priority = ref<TaskInput['priority']>(props.task?.priority ?? 'medium')
const error = ref('')

onMounted(async () => {
  dialog.value?.showModal()
  await nextTick()
  titleInput.value?.focus()
})

function submit() {
  error.value = validateTitle(title.value)
  if (error.value) {
    titleInput.value?.focus()
    return
  }
  emit('save', { title: title.value, description: description.value, status: status.value, priority: priority.value })
}

function backdropClick(event: MouseEvent) {
  if (event.target === dialog.value) dialog.value?.close()
}
</script>

<template>
  <dialog ref="dialog" class="task-dialog" aria-labelledby="task-dialog-title" @close="emit('close')" @click="backdropClick">
    <form class="dialog-content" @submit.prevent="submit">
      <div class="dialog-header">
        <div>
          <h2 id="task-dialog-title" class="dialog-title">{{ task ? '编辑任务' : '新建任务' }}</h2>
          <p class="dialog-subtitle">记录要做的事，随时调整进度。</p>
        </div>
        <button class="icon-button" type="button" aria-label="关闭弹窗" @click="dialog?.close()"><X :size="19" /></button>
      </div>

      <div class="form-field">
        <label for="task-title">任务标题 <span class="required">*</span></label>
        <input id="task-title" ref="titleInput" v-model="title" type="text" placeholder="例如：完成项目需求文档" :aria-invalid="!!error" :aria-describedby="error ? 'title-error' : undefined" @input="error = ''" />
        <p v-if="error" id="title-error" class="field-error">{{ error }}</p>
      </div>
      <div class="form-field">
        <label for="task-description">描述 <span class="optional">选填</span></label>
        <textarea id="task-description" v-model="description" rows="4" placeholder="补充任务细节…" />
      </div>
      <div class="form-row">
        <div class="form-field">
          <label for="task-status">状态</label>
          <select id="task-status" v-model="status">
            <option v-for="option in STATUSES" :key="option" :value="option">{{ statusLabel[option] }}</option>
          </select>
        </div>
        <div class="form-field">
          <label for="task-priority">优先级</label>
          <select id="task-priority" v-model="priority">
            <option v-for="option in PRIORITIES" :key="option" :value="option">{{ priorityLabel[option] }}</option>
          </select>
        </div>
      </div>

      <div class="dialog-actions">
        <button class="button-secondary" type="button" @click="dialog?.close()">取消</button>
        <button class="button-primary" type="submit">{{ task ? '保存修改' : '创建任务' }}</button>
      </div>
    </form>
  </dialog>
</template>
