import path from 'path'
import fs from 'fs-extra'

export function findup<T>(
  rootDir: string,
  fn: (dir: string) => T | undefined,
): T | null {
  let dir = rootDir
  while (dir !== path.dirname(dir)) {
    const res = fn(dir)
    if (res) {
      return res
    }
    dir = path.dirname(dir)
  }
  return null
}

export function lookupFile(
  dir: string,
  formats: string[],
  pathOnly = false,
): string | undefined {
  for (const format of formats) {
    const fullPath = path.join(dir, format)
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
      return pathOnly ? fullPath : fs.readFileSync(fullPath, 'utf-8')
    }
  }
  const parentDir = path.dirname(dir)
  if (parentDir !== dir) {
    return lookupFile(parentDir, formats, pathOnly)
  }
}
