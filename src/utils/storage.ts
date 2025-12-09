import AsyncStorage from '@react-native-async-storage/async-storage'
import type { Task } from '../store/tasks'

const TASKS_KEY = '@todo/tasks'
const THEME_KEY = '@todo/theme'
const ACCENT_KEY = '@todo/accent'

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

export async function saveAccent(color: string) {
  try {
    await AsyncStorage.setItem(ACCENT_KEY, color)
  } catch {}
}

export async function loadAccent(): Promise<string | null> {
  try {
    const v = await AsyncStorage.getItem(ACCENT_KEY)
    return typeof v === 'string' && /^#([0-9a-f]{6})$/i.test(v) ? v : null
  } catch {
    return null
  }
}