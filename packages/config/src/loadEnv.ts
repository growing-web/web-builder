// modify from vite
import { arraify, fs, lookupFile } from '@growing-web/web-builder-kit'
import dotenv from 'dotenv'
import { expand as dotenvExpand } from 'dotenv-expand'

export function loadEnv(
  mode: string,
  envDir: string,
  prefixes: string | string[] = 'WEB_',
): Record<string, string> {
  if (mode === 'local') {
    throw new Error(
      `"local" cannot be used as a mode name because it conflicts with ` +
        `the .local postfix for .env files.`,
    )
  }
  prefixes = arraify(prefixes)
  const env: Record<string, string> = {}
  const envFiles = [
    /** mode local file */ `.env.${mode}.local`,
    /** mode file */ `.env.${mode}`,
    /** local file */ `.env.local`,
    /** default file */ `.env`,
  ]

  // check if there are actual env variables starting with VITE_*
  // these are typically provided inline and should be prioritized
  for (const key in process.env) {
    if (
      prefixes.some((prefix) => key.startsWith(prefix)) &&
      env[key] === undefined
    ) {
      env[key] = process.env[key] as string
    }
  }

  for (const file of envFiles) {
    const path = lookupFile(envDir, [file], true)
    if (path) {
      const parsed = dotenv.parse(fs.readFileSync(path))

      // let environment variables use each other
      dotenvExpand({
        parsed,
        // prevent process.env mutation
        ignoreProcessEnv: true,
      })

      // only keys that start with prefix are exposed to client
      for (const [key, value] of Object.entries(parsed)) {
        if (
          prefixes.some((prefix) => key.startsWith(prefix)) &&
          env[key] === undefined
        ) {
          env[key] = value
        } else if (
          key === 'NODE_ENV' &&
          process.env.WEB_BUILDER_USER_NODE_ENV === undefined
        ) {
          // NODE_ENV override in .env file
          process.env.WEB_BUILDER_USER_NODE_ENV = value
        }
      }
    }
  }
  return env
}
