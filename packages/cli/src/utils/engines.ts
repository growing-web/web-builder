import pkg from '../../package.json'
import { satisfies } from 'semver'
import { Logger } from '@growing-web/web-builder-shared'

export async function checkEngines() {
  const currentNode = process.versions.node
  const nodeRange = pkg?.engines?.node ?? ''

  if (!satisfies(currentNode, nodeRange)) {
    Logger.warn(
      `Current version of Node.js (\`${currentNode}\`) is unsupported and might cause issues.\n       Please upgrade to a compatible version (${nodeRange}).`,
    )
  }
}
