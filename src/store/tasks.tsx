import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { loadTasks, saveTasks } from '../utils/storage'

export type Task = {
  id: string
  title: string
  description?: string
  completed: boolean
  createdAt: number
  dueDate?: number
}

type State = {
  tasks: Task[]
  loading: boolean
}

type Actions =
  | { type: 'hydrate'; tasks: Task[] }
  | { type: 'add'; task: Task }
  | { type: 'toggle'; id: string }
  | { type: 'delete'; id: string }

const STORAGE_KEY = '@todo/tasks'

function reducer(state: State, action: Actions): State {
  switch (action.type) {
    case 'hydrate':
      return { tasks: action.tasks, loading: false }
    case 'add':
      return { ...state, tasks: [action.task, ...state.tasks] }
    case 'toggle':
      return {
        ...state,
        tasks: state.tasks.map(task => (task.id === action.id ? { ...task, completed: !task.completed } : task)),
      }
    case 'delete':
      return { ...state, tasks: state.tasks.filter(task => task.id !== action.id) }
    default:
      return state
  }
}

type TaskContextValue = {
  tasks: Task[]
  loading: boolean
  addTask: (title: string, description?: string, dueDate?: number) => Promise<void>
  toggleTask: (id: string) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  restoreTask: (task: Task) => Promise<void>
}

const TaskContext = createContext<TaskContextValue | undefined>(undefined)

async function save(tasks: Task[]) {
  await saveTasks(tasks)
}

async function load(): Promise<Task[]> {
  return loadTasks()
}

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { tasks: [], loading: true })

  useEffect(() => {
    load().then(tasks => dispatch({ type: 'hydrate', tasks }))
  }, [])

  useEffect(() => {
    if (!state.loading) save(state.tasks)
  }, [state.tasks, state.loading])

  const value = useMemo<TaskContextValue>(() => {
    return {
      tasks: state.tasks,
      loading: state.loading,
      addTask: async (title, description, dueDate) => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
        const task: Task = { id, title: title.trim(), description: description?.trim(), completed: false, createdAt: Date.now(), dueDate }
        dispatch({ type: 'add', task })
      },
      toggleTask: async id => {
        dispatch({ type: 'toggle', id })
      },
      deleteTask: async id => {
        dispatch({ type: 'delete', id })
      },
      restoreTask: async task => {
        dispatch({ type: 'add', task })
      },
    }
  }, [state.tasks, state.loading])

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}

export function useTasks() {
  const ctx = useContext(TaskContext)
  if (!ctx) throw new Error('TaskContext')
  return ctx
}