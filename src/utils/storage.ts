import AsyncStorage from '@react-native-async-storage/async-storage'
import type { Task } from '../store/tasks'

const TASKS_KEY = '@todo/tasks'
const THEME_KEY = '@todo/theme'

export async function saveTasks(tasks: Task[]) {
  try {
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
  } catch {}
}

export async function loadTasks(): Promise<Task[]> {
  try {
    const json = await AsyncStorage.getItem(TASKS_KEY)
    if (!json) return []
    const data: Task[] = JSON.parse(json)
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

export async function saveTheme(theme: 'light' | 'dark') {
  try {
    await AsyncStorage.setItem(THEME_KEY, theme)
  } catch {}
}

export async function loadTheme(): Promise<'light' | 'dark' | null> {
  try {
    const v = await AsyncStorage.getItem(THEME_KEY)
    return v === 'light' || v === 'dark' ? v : null
  } catch {
    return null
  }
}