<script setup lang="ts">
import { computed, ref } from 'vue'
import { ListTodo, Pencil, Search, Trash2 } from 'lucide-vue-next'
import { priorityLabel, statusLabel, type Task } from '../types/task'

const props = defineProps<{ tasks: Task[] }>()
const emit = defineEmits<{ edit: [task: Task]; delete: [task: Task] }>()
const search = ref('')
const filtered = computed(() => {
  const query = search.value.trim().toLocaleLowerCase()
  if (!query) return props.tasks
  return props.tasks.filter((task) => `${task.title} ${task.description}`.toLocaleLowerCase().includes(query))
})
</script>

<template>
  <section class="list-view" aria-label="任务列表">
    <div class="list-toolbar">
      <div class="section-heading">
        <h2>全部任务</h2>
        <span class="count-chip">{{ tasks.length }}</span>
      </div>
      <label class="search-box">
        <Search :size="18" aria-hidden="true" />
        <span class="sr-only">搜索任务</span>
        <input v-model="search" type="search" placeholder="搜索任务..." />
      </label>
    </div>

    <div v-if="filtered.length === 0" class="list-empty">
      <span class="empty-icon"><ListTodo :size="26" :stroke-width="1.7" /></span>
      <h3>{{ tasks.length === 0 ? '还没有任务' : '没有找到匹配的任务' }}</h3>
      <p>{{ tasks.length === 0 ? '点击“新建任务”，开始规划今天的工作。' : '试试其他关键词。' }}</p>
    </div>

    <template v-else>
      <div class="desktop-table-wrap">
        <table class="task-table">
          <thead>
            <tr><th scope="col">标题</th><th scope="col">描述</th><th scope="col">状态</th><th scope="col">优先级</th><th scope="col" class="actions-col">操作</th></tr>
          </thead>
          <tbody>
            <tr v-for="task in filtered" :key="task.id">
              <td class="title-cell"><button type="button" @click="emit('edit', task)">{{ task.title }}</button></td>
              <td class="description-cell">{{ task.description || '—' }}</td>
              <td><span class="status-chip" :class="`status-${task.status}`">{{ statusLabel[task.status] }}</span></td>
              <td><span class="priority-label"><i class="priority-dot" :class="`priority-${task.priority}`" />{{ priorityLabel[task.priority] }}</span></td>
              <td><div class="row-actions"><button class="icon-button" type="button" :aria-label="`编辑${task.title}`" @click="emit('edit', task)"><Pencil :size="17" /></button><button class="icon-button" type="button" :aria-label="`删除${task.title}`" @click="emit('delete', task)"><Trash2 :size="17" /></button></div></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="mobile-list">
        <article v-for="task in filtered" :key="task.id" class="mobile-task">
          <div class="mobile-task-top"><h3>{{ task.title }}</h3><span class="priority-label"><i class="priority-dot" :class="`priority-${task.priority}`" />{{ priorityLabel[task.priority] }}</span></div>
          <p v-if="task.description" class="mobile-task-description">{{ task.description }}</p>
          <div class="mobile-task-bottom"><span class="status-chip" :class="`status-${task.status}`">{{ statusLabel[task.status] }}</span><div class="row-actions"><button class="icon-button" type="button" :aria-label="`编辑${task.title}`" @click="emit('edit', task)"><Pencil :size="17" /></button><button class="icon-button" type="button" :aria-label="`删除${task.title}`" @click="emit('delete', task)"><Trash2 :size="17" /></button></div></div>
        </article>
      </div>
      <div class="list-footer">显示 {{ filtered.length }} 项任务<span v-if="search.trim()">，共 {{ tasks.length }} 项</span></div>
    </template>
  </section>
</template>
