import { fs } from './lib'

export function arraify<T>(target: T | T[]): T[] {
  return Array.isArray(target) ? target : [target]
}

export function tryResolvePaths(paths: string[]) {
  for (const path of paths) {
    if (fs.existsSync(path)) {
      return path
    }
  }
}
