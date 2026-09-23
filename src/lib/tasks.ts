import { STATUSES, type Task, type TaskInput } from '../types/task'

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
