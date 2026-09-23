import { parseTasks } from './tasks'
import type { Task } from '../types/task'

export const TASKS_KEY = 'task-manager:v1:tasks'
export const THEME_KEY = 'task-manager:v1:theme'

// Accessing localStorage itself can throw when a browser blocks storage.
export const browserStorage: Pick<Storage, 'getItem' | 'setItem'> = {
  getItem(key) { return window.localStorage.getItem(key) },
  setItem(key, value) { window.localStorage.setItem(key, value) },
}

export interface LoadResult<T> {
  value: T
  error: string | null
}

export function loadTasks(storage: Pick<Storage, 'getItem'>): LoadResult<Task[]> {
  try {
    return { value: parseTasks(storage.getItem(TASKS_KEY)), error: null }
  } catch {
    return { value: [], error: '无法读取本地任务数据，当前显示空列表。' }
  }
}

export function saveTasks(storage: Pick<Storage, 'setItem'>, tasks: Task[]): boolean {
  try {
    storage.setItem(TASKS_KEY, JSON.stringify(tasks))
    return true
  } catch {
    return false
  }
}

export function loadTheme(storage: Pick<Storage, 'getItem'>): 'light' | 'dark' | null {
  try {
    const theme = storage.getItem(THEME_KEY)
    return theme === 'light' || theme === 'dark' ? theme : null
  } catch {
    return null
  }
}

export function saveTheme(storage: Pick<Storage, 'setItem'>, theme: 'light' | 'dark'): boolean {
  try {
    storage.setItem(THEME_KEY, theme)
    return true
  } catch {
    return false
  }
}
