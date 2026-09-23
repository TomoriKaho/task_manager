import { describe, expect, it } from 'vitest'
import { createTask, deleteTask, updateTask, validateTitle } from './tasks'
import type { TaskInput } from '../types/task'

const now = '2026-09-24T00:00:00.000Z'
const base: TaskInput = { title: '  完成需求文档  ', description: '  整理用户故事  ', status: 'todo', priority: 'medium' }

describe('task creation and validation', () => {
  it('rejects blank titles and trims entered text', () => {
    expect(validateTitle(' \n  ')).toBe('请输入任务标题')
    expect(createTask([], { ...base, title: '   ' }, 'id-1', now)).toEqual([])
    const [task] = createTask([], base, 'id-1', now)
    expect(task).toMatchObject({ id: 'id-1', title: '完成需求文档', description: '整理用户故事', status: 'todo', priority: 'medium', order: 0 })
  })

  it('keeps an optional description empty', () => {
    const [task] = createTask([], { ...base, description: '' }, 'id-1', now)
    expect(task.description).toBe('')
  })
})

describe('task editing and deletion', () => {
  it('edits fields and places a status change at the end of its new group', () => {
    const first = createTask([], base, 'first', now)
    const tasks = createTask(first, { ...base, title: '已经在进行' , status: 'doing' }, 'second', now)
    const updated = updateTask(tasks, 'first', { title: '修改后的任务', description: '', status: 'doing', priority: 'high' }, '2026-09-24T01:00:00.000Z')
    expect(updated.find((task) => task.id === 'first')).toMatchObject({ title: '修改后的任务', status: 'doing', priority: 'high', order: 1 })
    expect(updated.find((task) => task.id === 'second')?.order).toBe(0)
  })

  it('deletes a task and compacts the remaining order', () => {
    const first = createTask([], base, 'first', now)
    const second = createTask(first, { ...base, title: '第二项' }, 'second', now)
    const remaining = deleteTask(second, 'first')
    expect(remaining).toHaveLength(1)
    expect(remaining[0]).toMatchObject({ id: 'second', order: 0 })
  })
})
