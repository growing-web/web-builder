import type { Recordable } from '@growing-web/web-builder-types'
import { arraify, isObject } from '@growing-web/web-builder-kit'

export function mergeManifestConfig<T>(
  defaultConfig: Recordable<any>,
  overrides: Recordable<any>,
  root = true,
) {
  const merged = { ...defaultConfig }

  for (const [key, value] of Object.entries(overrides)) {
    if (value == null) {
      continue
    }

    const existing = merged[key]
    if (existing == null) {
      merged[key] = value
      continue
    }

    if (key === 'entries') {
      if (Array.isArray(existing) && Array.isArray(value)) {
        let max = 0
        ;(existing || []).forEach((item, index) => {
          if (value[index] && root) {
            existing[index] = mergeManifestConfig(item, value[index], false)
            max = index
          }
        })
        if (max < value.length - 1) {
          for (let index = max; index < value.length; index++) {
            existing[index] = value[index]
          }
        }
      }
      continue
    }

    if (Array.isArray(existing) || Array.isArray(value)) {
      merged[key] = Array.from(
        new Set([...arraify(existing ?? []), ...arraify(value ?? [])]),
      )
      continue
    }

    if (isObject(existing) && isObject(value)) {
      merged[key] = mergeManifestConfig(existing, value, false)
      continue
    }

    merged[key] = value
  }
  return merged as T
}
