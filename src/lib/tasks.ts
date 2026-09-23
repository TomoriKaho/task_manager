import { PRIORITIES, STATUSES, type Task, type TaskInput, type TaskStatus } from '../types/task'

const validStatus = (value: unknown): value is TaskStatus => STATUSES.includes(value as TaskStatus)
const validPriority = (value: unknown): value is Task['priority'] => PRIORITIES.includes(value as Task['priority'])

export function validateTitle(title: string): string {
  return title.trim() ? '' : '请输入任务标题'
}

export function createTask(tasks: Task[], input: TaskInput, id: string, now: string): Task[] {
  if (validateTitle(input.title)) return tasks
  const order = tasks.filter((task) => task.status === input.status).length
  return [...tasks, {
    id,
    title: input.title.trim(),
    description: input.description.trim(),
    status: input.status,
    priority: input.priority,
    order,
    createdAt: now,
    updatedAt: now,
  }]
}

export function updateTask(tasks: Task[], id: string, input: TaskInput, now: string): Task[] {
  const current = tasks.find((task) => task.id === id)
  if (!current || validateTitle(input.title)) return tasks
  const next = tasks.map((task) => task.id === id ? {
    ...task,
    title: input.title.trim(),
    description: input.description.trim(),
    status: input.status,
    priority: input.priority,
    order: current.status === input.status ? current.order : tasks.filter((other) => other.status === input.status).length,
    updatedAt: now,
  } : task)
  return normalizeOrder(next)
}

export function deleteTask(tasks: Task[], id: string): Task[] {
  return normalizeOrder(tasks.filter((task) => task.id !== id))
}

export function parseTasks(raw: string | null): Task[] {
  if (raw === null) return []
  const data: unknown = JSON.parse(raw)
  if (!Array.isArray(data) || !data.every(isTask)) throw new Error('Invalid stored tasks')
  const ids = new Set(data.map((task: Task) => task.id))
  if (ids.size !== data.length) throw new Error('Duplicate task IDs')
  return normalizeOrder(data)
}

function compareOrder(a: Task, b: Task): number {
  return a.order - b.order || a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id)
}

function normalizeOrder(tasks: Task[]): Task[] {
  const positions = new Map<string, number>()
  for (const status of STATUSES) {
    tasks.filter((task) => task.status === status).sort(compareOrder).forEach((task, index) => positions.set(task.id, index))
  }
  return tasks.map((task) => ({ ...task, order: positions.get(task.id) ?? 0 }))
}

function isTask(value: unknown): value is Task {
  if (!value || typeof value !== 'object') return false
  const task = value as Partial<Task>
  return typeof task.id === 'string' && task.id.length > 0
    && typeof task.title === 'string' && !!task.title.trim()
    && typeof task.description === 'string'
    && validStatus(task.status) && validPriority(task.priority)
    && typeof task.order === 'number' && Number.isInteger(task.order) && task.order >= 0
    && typeof task.createdAt === 'string' && !Number.isNaN(Date.parse(task.createdAt))
    && typeof task.updatedAt === 'string' && !Number.isNaN(Date.parse(task.updatedAt))
}
