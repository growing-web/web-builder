import { Logger } from '@growing-web/web-builder-shared'
import chalk from 'chalk'

type BundlerType =
  typeof import('@growing-web/web-builder-bundler-vite').Bundler

// default bundler
export const DEFAULT_BUNDLER = 'vite'

// TODO support webpack
export async function getBundler(): Promise<BundlerType> {
  try {
    // @ts-ignore skip
    const viteBundler = await import('@growing-web/web-builder-bundler-vite')
    return viteBundler.Bundler
  } catch (error) {
    Logger.error(
      `You are currently using the 'vite' bundler. To use this service, you need to install the '@growing-web/web-builder-bundler-vite' dependency into your project, execute '${chalk.cyan(
        'npm install @growing-web/web-builder-bundler-vite -D',
      )}' can be installed`,
    )
    process.exit(1)
  }
}
