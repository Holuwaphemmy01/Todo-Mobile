export function extractTasks(input: string): string[] {
  const normalized = input.toLowerCase().replace(/\s+/g, ' ').trim()
  if (!normalized) return []
  const joints = [',', ';', ' and ', ' then ', ' also ', ' next ']
  let segments: string[] = [normalized]
  for (const delimiter of joints) {
    segments = segments.flatMap(segment => segment.split(delimiter))
  }
  const cleaned = segments
    .map(segment => segment.replace(/^[\s\-\•]+/, '').trim())
    .filter(Boolean)
  const unique: string[] = []
  for (const cleanedSegment of cleaned) {
    if (!unique.some(existingItem => similarity(existingItem, cleanedSegment) > 0.9)) unique.push(cleanedSegment)
  }
  return unique.map(taskText => taskText[0].toUpperCase() + taskText.slice(1))
}

function similarity(first: string, second: string) {
  const setA = new Set(first.split(' '))
  const setB = new Set(second.split(' '))
  const inter = [...setA].filter(word => setB.has(word)).length
  const union = new Set([...setA, ...setB]).size
  return inter / union
}