export function extractTasks(input: string): string[] {
  const normalized = input.toLowerCase().replace(/\s+/g, ' ').trim()
  if (!normalized) return []
  const joints = [',', ';', ' and ', ' then ', ' also ', ' next ']
  let segments: string[] = [normalized]
  for (const j of joints) {
    segments = segments.flatMap(s => s.split(j))
  }
  const cleaned = segments
    .map(s => s.replace(/^[\s\-\•]+/, '').trim())
    .filter(Boolean)
  const unique: string[] = []
  for (const s of cleaned) {
    if (!unique.some(u => similarity(u, s) > 0.9)) unique.push(s)
  }
  return unique.map(s => s[0].toUpperCase() + s.slice(1))
}

function similarity(a: string, b: string) {
  const setA = new Set(a.split(' '))
  const setB = new Set(b.split(' '))
  const inter = [...setA].filter(x => setB.has(x)).length
  const union = new Set([...setA, ...setB]).size
  return inter / union
}