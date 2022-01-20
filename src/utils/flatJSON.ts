export type FlatJSON = {
  key: string | undefined
  value: any
}

export function flatJSON(target: Record<string, any>): FlatJSON[] {
  const output: FlatJSON[] = []

  function step(object: Record<string, any>, prev?: string) {
    Object.entries(object).forEach(function ([key, value]) {
      const falseKeys: Record<string, undefined> = {
        undefined: undefined,
      }

      const newKey =
        key in falseKeys ? falseKeys[key] : prev ? `${prev}.${key}` : key

      if (typeof value === 'object' && Object.keys(value).length) {
        return step(value, newKey)
      }

      output.push({ key: newKey, value })
    })
  }

  step(target)

  return output
}
