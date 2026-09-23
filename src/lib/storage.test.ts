import { describe, expect, it } from 'vitest'
import { createTask, moveTask } from './tasks'
import { loadTasks, loadTheme, saveTasks, saveTheme, TASKS_KEY, THEME_KEY } from './storage'

function memoryStorage() {
  const items = new Map<string, string>()
  return {
    getItem: (key: string) => items.get(key) ?? null,
    setItem: (key: string, value: string) => { items.set(key, value) },
  }
}

const sample = createTask([], {
  title: '编写测试', description: '', status: 'todo', priority: 'high',
}, 'task-1', '2026-09-24T00:00:00.000Z')

describe('task storage', () => {
  it('round-trips tasks with their status, priority and order', () => {
    const storage = memoryStorage()
    expect(saveTasks(storage, sample)).toBe(true)
    expect(loadTasks(storage)).toEqual({ value: sample, error: null })
  })

  it('preserves board order after a move and reload', () => {
    const storage = memoryStorage()
    const second = createTask(sample, { title: '第二项', description: '', status: 'todo', priority: 'medium' }, 'task-2', '2026-09-24T00:01:00.000Z')
    const moved = moveTask(second, 'task-1', 'todo', 1, '2026-09-24T00:02:00.000Z')
    saveTasks(storage, moved)
    expect(loadTasks(storage).value.filter((task) => task.status === 'todo').sort((a, b) => a.order - b.order).map((task) => task.id)).toEqual(['task-2', 'task-1'])
  })

  it('starts empty when there is no stored task data', () => {
    expect(loadTasks(memoryStorage())).toEqual({ value: [], error: null })
  })

  it('rejects malformed JSON and invalid task records without crashing', () => {
    const storage = memoryStorage()
    storage.setItem(TASKS_KEY, '{bad json')
    expect(loadTasks(storage)).toMatchObject({ value: [], error: expect.any(String) })
    storage.setItem(TASKS_KEY, JSON.stringify([{ ...sample[0], status: 'unknown' }]))
    expect(loadTasks(storage)).toMatchObject({ value: [], error: expect.any(String) })
    storage.setItem(TASKS_KEY, JSON.stringify([sample[0], sample[0]]))
    expect(loadTasks(storage)).toMatchObject({ value: [], error: expect.any(String) })
  })

  it('reports blocked reads and writes while allowing memory-only use', () => {
    const blocked = { getItem: () => { throw new Error('blocked') }, setItem: () => { throw new Error('blocked') } }
    expect(loadTasks(blocked)).toMatchObject({ value: [], error: expect.any(String) })
    expect(saveTasks(blocked, sample)).toBe(false)
  })
})

describe('theme storage', () => {
  it('uses a separate key and restores an explicit selection', () => {
    const storage = memoryStorage()
    expect(saveTheme(storage, 'dark')).toBe(true)
    expect(storage.getItem(THEME_KEY)).toBe('dark')
    expect(storage.getItem(TASKS_KEY)).toBeNull()
    expect(loadTheme(storage)).toBe('dark')
    storage.setItem(THEME_KEY, 'invalid')
    expect(loadTheme(storage)).toBeNull()
  })
})
