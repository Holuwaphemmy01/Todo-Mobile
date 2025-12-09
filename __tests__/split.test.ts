import { extractTasks } from '../src/utils/split'

describe('extractTasks', () => {
  test('splits by commas and and/then', () => {
    const input = 'Buy milk, call mom and finish report then sleep'
    const tasks = extractTasks(input)
    expect(tasks).toEqual(expect.arrayContaining(['Buy milk', 'Call mom', 'Finish report', 'Sleep']))
  })

  test('dedupes near-duplicates', () => {
    const input = 'Buy milk and buy milk'
    const tasks = extractTasks(input)
    expect(tasks.filter(t => t.toLowerCase().includes('buy milk')).length).toBe(1)
  })
})