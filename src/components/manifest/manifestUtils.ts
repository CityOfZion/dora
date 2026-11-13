export type ManifestParameter = {
  name: string
  type: string
}

export type ManifestMethod = {
  name: string
  parameters: ManifestParameter[]
  returntype: string
  offset?: number
  safe?: boolean
}

export type ManifestEvent = {
  name: string
  parameters: ManifestParameter[]
}

export type ContractManifest = {
  abi: {
    methods?: ManifestMethod[]
    events?: ManifestEvent[]
  }
}

export type TypeGroup = 'primitive' | 'bytes' | 'collection' | 'other'
export type MethodKind = 'safe' | 'write' | 'system'
export type SortOrder = 'manifest' | 'az'

const TYPE_GROUPS: Record<string, TypeGroup> = {
  Integer: 'primitive',
  Boolean: 'primitive',
  String: 'primitive',
  Hash160: 'bytes',
  Hash256: 'bytes',
  ByteArray: 'bytes',
  ByteString: 'bytes',
  PublicKey: 'bytes',
  Signature: 'bytes',
  Array: 'collection',
  Map: 'collection',
}

export const METHOD_GROUPS: {
  kind: MethodKind
  title: string
  description: string
}[] = [
  {
    kind: 'safe',
    title: 'Read-only',
    description: 'marked safe in the manifest; cannot change contract state',
  },
  { kind: 'write', title: 'State-changing', description: 'may write storage' },
  {
    kind: 'system',
    title: 'System callbacks',
    description: 'system triggered',
  },
]

export const typeGroup = (type: string): TypeGroup =>
  TYPE_GROUPS[type] ?? 'other'

// Methods starting with an underscore (_deploy, _initialize) are invoked by
// the VM rather than by users.
export const methodKind = (method: ManifestMethod): MethodKind => {
  if (method.name.startsWith('_')) return 'system'
  return method.safe ? 'safe' : 'write'
}

export const sortByName = <T extends { name: string }>(
  items: T[],
  order: SortOrder,
): T[] =>
  order === 'az'
    ? [...items].sort((a, b) =>
        a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }),
      )
    : items

const normalize = (query: string): string => query.trim().toLowerCase()

export const matchesQuery = (
  item: { name: string; parameters: ManifestParameter[] },
  query: string,
): boolean => {
  const q = normalize(query)
  if (!q) return true
  return (
    item.name.toLowerCase().includes(q) ||
    item.parameters.some(p => p.name.toLowerCase().includes(q))
  )
}

export const splitMatch = (
  text: string,
  query: string,
): { pre: string; hit: string; post: string } => {
  const q = normalize(query)
  const index = q ? text.toLowerCase().indexOf(q) : -1
  if (index < 0) return { pre: text, hit: '', post: '' }
  return {
    pre: text.slice(0, index),
    hit: text.slice(index, index + q.length),
    post: text.slice(index + q.length),
  }
}

export const formatSignature = (
  item: { name: string; parameters: ManifestParameter[] },
  returntype?: string,
): string => {
  const params = item.parameters.map(p => `${p.name}: ${p.type}`).join(', ')
  return `${item.name}(${params})${returntype ? `: ${returntype}` : ''}`
}
