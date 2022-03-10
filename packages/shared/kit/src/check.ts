import semver from 'semver'
import { createLogger } from './logger'

async function checkNodeEngines(engines: { node: string }) {
  const currentNode = process.versions.node
  const nodeRange = engines?.node ?? ''

  const logger = createLogger()

  if (!semver.satisfies(currentNode, nodeRange)) {
    logger.error(
      `Current version of Node.js (\`${currentNode}\`) is unsupported and might cause issues.\n       Please upgrade to a compatible version (${nodeRange}).`,
    )
    process.exit(1)
  }
}

export { checkNodeEngines }
