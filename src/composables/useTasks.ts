import { ref } from 'vue'
import { createTask, deleteTask, updateTask } from '../lib/tasks'
import { browserStorage, loadTasks, saveTasks } from '../lib/storage'
import type { Task, TaskInput } from '../types/task'

export function useTasks() {
  const loaded = loadTasks(browserStorage)
  const tasks = ref<Task[]>(loaded.value)
  const storageWarning = ref(loaded.error)

  function persist() {
    if (saveTasks(browserStorage, tasks.value)) storageWarning.value = null
    else storageWarning.value = '浏览器无法保存数据；刷新页面后本次修改可能丢失。'
  }

  function add(input: TaskInput) {
    tasks.value = createTask(tasks.value, input, crypto.randomUUID(), new Date().toISOString())
    persist()
  }

  function update(id: string, input: TaskInput) {
    tasks.value = updateTask(tasks.value, id, input, new Date().toISOString())
    persist()
  }

  function remove(id: string) {
    tasks.value = deleteTask(tasks.value, id)
    persist()
  }

  return { tasks, storageWarning, add, update, remove }
}
