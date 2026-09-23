import { ref } from 'vue'
import { createTask, deleteTask, updateTask } from '../lib/tasks'
import type { TaskInput } from '../types/task'

export function useTasks() {
  const tasks = ref([] as ReturnType<typeof createTask>)

  function add(input: TaskInput) {
    tasks.value = createTask(tasks.value, input, crypto.randomUUID(), new Date().toISOString())
  }

  function update(id: string, input: TaskInput) {
    tasks.value = updateTask(tasks.value, id, input, new Date().toISOString())
  }

  function remove(id: string) {
    tasks.value = deleteTask(tasks.value, id)
  }

  return { tasks, add, update, remove }
}
