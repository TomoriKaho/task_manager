export const STATUSES = ['todo', 'doing', 'done'] as const
export const PRIORITIES = ['high', 'medium', 'low'] as const

export type TaskStatus = (typeof STATUSES)[number]
export type TaskPriority = (typeof PRIORITIES)[number]

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  order: number
  createdAt: string
  updatedAt: string
}

export type TaskInput = Pick<Task, 'title' | 'description' | 'status' | 'priority'>

export const statusLabel: Record<TaskStatus, string> = {
  todo: '待办',
  doing: '进行中',
  done: '完成',
}

export const priorityLabel: Record<TaskPriority, string> = {
  high: '高',
  medium: '中',
  low: '低',
}
