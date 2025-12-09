import { loadTasks, saveTasks, loadTheme, saveTheme } from '../src/utils/storage'

const sample = [
  { id: '1', title: 'A', completed: false, createdAt: Date.now() },
  { id: '2', title: 'B', completed: true, createdAt: Date.now() },
]

describe('storage', () => {
  test('save and load tasks', async () => {
    await saveTasks(sample as any)
    const out = await loadTasks()
    expect(out.length).toBe(2)
    expect(out[0].title).toBe('A')
  })

  test('save and load theme', async () => {
    await saveTheme('dark')
    const v = await loadTheme()
    expect(v).toBe('dark')
  })
})