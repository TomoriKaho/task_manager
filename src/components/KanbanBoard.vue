<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import Sortable from 'sortablejs'
import { GripVertical, Plus } from 'lucide-vue-next'
import { STATUSES, priorityLabel, statusLabel, type Task, type TaskStatus } from '../types/task'
import { tasksInStatus } from '../lib/tasks'

defineProps<{ tasks: Task[] }>()
const emit = defineEmits<{ edit: [task: Task]; add: [status: TaskStatus]; move: [id: string, status: TaskStatus, index: number] }>()
const columnElements = new Map<TaskStatus, HTMLElement>()
const sectionElements = new Map<TaskStatus, HTMLElement>()
const sortables: Sortable[] = []

function setColumnRef(status: TaskStatus, element: unknown) {
  if (element instanceof HTMLElement) columnElements.set(status, element)
}

function setSectionRef(status: TaskStatus, element: unknown) {
  if (element instanceof HTMLElement) sectionElements.set(status, element)
}

function jumpTo(status: TaskStatus) {
  sectionElements.get(status)?.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    block: 'start',
  })
}

onMounted(() => {
  for (const status of STATUSES) {
    const element = columnElements.get(status)
    if (!element) continue
    sortables.push(Sortable.create(element, {
      group: 'task-board',
      draggable: '.task-card',
      handle: '.drag-handle',
      animation: 160,
      ghostClass: 'task-ghost',
      chosenClass: 'task-chosen',
      fallbackClass: 'task-fallback',
      forceFallback: true,
      fallbackOnBody: true,
      delayOnTouchOnly: true,
      delay: 150,
      touchStartThreshold: 4,
      scroll: true,
      bubbleScroll: true,
      scrollSensitivity: 70,
      scrollSpeed: 12,
      onEnd(event) {
        const id = (event.item as HTMLElement).dataset.taskId
        const target = (event.to as HTMLElement).dataset.status as TaskStatus | undefined
        // Sortable moves DOM nodes itself. Put the node back so Vue can reconcile
        // the change from the task state without seeing an externally moved child.
        const siblings = Array.from(event.from.children).filter((child) => child !== event.item && child.classList.contains('task-card'))
        event.from.insertBefore(event.item, siblings[event.oldDraggableIndex ?? 0] ?? null)
        if (!id || !target || !STATUSES.includes(target) || event.newDraggableIndex === undefined) return
        emit('move', id, target, event.newDraggableIndex)
      },
    }))
  }
})

onUnmounted(() => sortables.forEach((sortable) => sortable.destroy()))
</script>

<template>
  <section class="board-view" aria-label="任务看板">
    <nav class="board-jump" aria-label="快速定位状态">
      <button v-for="status in STATUSES" :key="status" type="button" @click="jumpTo(status)">{{ statusLabel[status] }} ({{ tasksInStatus(tasks, status).length }})</button>
    </nav>
    <div v-for="status in STATUSES" :key="status" :ref="(element) => setSectionRef(status, element)" class="board-column" :class="`column-${status}`">
      <div class="column-header"><h2>{{ statusLabel[status] }}</h2><span class="column-count">{{ tasksInStatus(tasks, status).length }}</span></div>
      <div :ref="(element) => setColumnRef(status, element)" class="column-tasks" :data-status="status">
        <article v-for="task in tasksInStatus(tasks, status)" :key="task.id" class="task-card" :data-task-id="task.id" @click="emit('edit', task)">
          <div class="card-top"><h3><button type="button" class="card-open" :aria-label="`编辑任务：${task.title}`" @click.stop="emit('edit', task)">{{ task.title }}</button></h3><button class="drag-handle" type="button" :aria-label="`拖动${task.title}`" title="拖动任务" @click.stop><GripVertical :size="18" /></button></div>
          <p v-if="task.description" class="card-description">{{ task.description }}</p>
          <div class="card-bottom"><span class="priority-label"><i class="priority-dot" :class="`priority-${task.priority}`" />{{ priorityLabel[task.priority] }}</span></div>
        </article>
        <div v-if="tasksInStatus(tasks, status).length === 0" class="column-empty">暂无任务</div>
      </div>
      <button type="button" class="column-add" @click="emit('add', status)"><Plus :size="17" /> 新建任务</button>
    </div>
  </section>
</template>
