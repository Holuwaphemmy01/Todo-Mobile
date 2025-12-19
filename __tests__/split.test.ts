import { extractTasks } from '../src/utils/split'

describe('split', () => {
  test('splits by connectors and punctuation', () => {
    const input = 'Buy milk and call mom; walk dog, then read book also next pay bills'
    const out = extractTasks(input)
    expect(out).toEqual(expect.arrayContaining(['Buy milk', 'Call mom', 'Walk dog', 'Read book']))
    expect(out.some(taskTitle => taskTitle.toLowerCase().includes('bills'))).toBe(true)
    expect(out.length).toBe(5)
  })

  test('removes bullets and trims', () => {
    const input = '- buy milk, • call Mom'
    const out = extractTasks(input)
    expect(out).toEqual(['Buy milk', 'Call mom'])
  })

  test('deduplicates identical tasks', () => {
    const input = 'Buy milk and buy milk'
    const out = extractTasks(input)
    expect(out).toEqual(['Buy milk'])
  })

  test('capitalizes first letter', () => {
    const input = 'call mom'
    const out = extractTasks(input)
    expect(out).toEqual(['Call mom'])
  })

  test('returns empty array for empty input', () => {
    expect(extractTasks('   ')).toEqual([])
  })
})