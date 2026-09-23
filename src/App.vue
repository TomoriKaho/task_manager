<script setup lang="ts">
import { ref, watch } from 'vue'
import { LayoutGrid, List, Moon, Plus, Sun } from 'lucide-vue-next'
import ConfirmDialog from './components/ConfirmDialog.vue'
import TaskFormModal from './components/TaskFormModal.vue'
import TaskList from './components/TaskList.vue'
import { useTasks } from './composables/useTasks'
import { STATUSES, statusLabel, type Task, type TaskInput, type TaskStatus } from './types/task'

type View = 'list' | 'board'
const view = ref<View>('list')
const theme = ref<'light' | 'dark'>(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
watch(theme, (value) => document.documentElement.classList.toggle('dark', value === 'dark'), { immediate: true })
const { tasks, add, update, remove } = useTasks()
const formOpen = ref(false)
const editingTask = ref<Task | null>(null)
const deletingTask = ref<Task | null>(null)
const initialStatus = ref<TaskStatus>('todo')

function openCreate() {
  editingTask.value = null
  initialStatus.value = 'todo'
  formOpen.value = true
}

function openEdit(task: Task) {
  editingTask.value = task
  formOpen.value = true
}

function saveTask(input: TaskInput) {
  if (editingTask.value) update(editingTask.value.id, input)
  else add(input)
  formOpen.value = false
}

function confirmDelete() {
  if (deletingTask.value) remove(deletingTask.value.id)
  deletingTask.value = null
}
</script>

<template>
  <div class="app-shell">
    <div class="workspace">
      <header class="topbar">
        <div class="topbar-main">
          <div class="brand"><span class="brand-mark"><List :size="19" :stroke-width="2.3" /></span><h1>任务</h1></div>
          <nav class="view-tabs" aria-label="视图切换">
            <button type="button" :class="{ active: view === 'list' }" :aria-current="view === 'list' ? 'page' : undefined" @click="view = 'list'"><List :size="17" />列表</button>
            <button type="button" :class="{ active: view === 'board' }" :aria-current="view === 'board' ? 'page' : undefined" @click="view = 'board'"><LayoutGrid :size="17" />看板</button>
          </nav>
          <button type="button" class="theme-toggle" :aria-label="theme === 'light' ? '切换深色模式' : '切换浅色模式'" @click="theme = theme === 'light' ? 'dark' : 'light'"><Sun :size="18" :class="{ selected: theme === 'light' }" /><Moon :size="18" :class="{ selected: theme === 'dark' }" /></button>
        </div>
      </header>
      <main class="main-content">
        <div class="page-actions">
          <div class="page-intro"><p class="eyeline">我的工作区</p><h2>{{ view === 'list' ? '任务列表' : '任务看板' }}</h2><p>{{ view === 'list' ? '集中查看和管理每一项任务。' : '拖动卡片，让进度一目了然。' }}</p></div>
          <button type="button" class="button-primary add-main" @click="openCreate"><Plus :size="18" />新建任务</button>
        </div>
        <TaskList v-if="view === 'list'" :tasks="tasks" @edit="openEdit" @delete="deletingTask = $event" />
        <section v-else class="board-view" aria-label="任务看板">
          <div v-for="status in STATUSES" :key="status" class="board-column" :class="`column-${status}`">
            <div class="column-header"><h2>{{ statusLabel[status] }}</h2><span class="column-count">{{ tasks.filter((task) => task.status === status).length }}</span></div>
            <div class="column-tasks"><div class="column-empty">看板卡片将在第 4 个里程碑开放</div></div>
          </div>
        </section>
      </main>
    </div>
    <TaskFormModal v-if="formOpen" :task="editingTask" :initial-status="initialStatus" @save="saveTask" @close="formOpen = false" />
    <ConfirmDialog v-if="deletingTask" :title="deletingTask.title" @confirm="confirmDelete" @close="deletingTask = null" />
  </div>
</template>
