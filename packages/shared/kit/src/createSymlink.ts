// modify from https://github.com/lerna/lerna/blob/main/utils/create-symlink/create-symlink.js
import type { Symlink } from '@growing-web/web-builder-types'
import cmdShim from 'cmd-shim'
import { fs, path } from './lib'

type ExecSymlink = Symlink | 'exec'

function createSymlink(src: string, dest: string, type: Symlink) {
  if (process.platform === 'win32') {
    return createWindowsSymlink(src, dest, type)
  }

  return createPosixSymlink(src, dest, type)
}

function createSymbolicLink(src: string, dest: string, type: Symlink) {
  return fs
    .lstat(dest)
    .then(() => fs.unlink(dest))
    .catch(() => {
      /* nothing exists at destination */
    })
    .then(() => fs.symlink(src, dest, type))
}

function createPosixSymlink(src: string, dest: string, _type: ExecSymlink) {
  const type = _type === 'exec' ? 'file' : _type
  const relativeSymlink = path.relative(path.dirname(dest), src)

  if (_type === 'exec') {
    // If the src exists, create a real symlink.
    // If the src doesn't exist yet, create a shim shell script.
    return fs.pathExists(src).then((exists) => {
      if (exists) {
        return createSymbolicLink(relativeSymlink, dest, type).then(() =>
          fs.chmod(src, 0o755),
        )
      }

      return shShim(src, dest, type).then(() => fs.chmod(dest, 0o755))
    })
  }

  return createSymbolicLink(relativeSymlink, dest, type)
}

function createWindowsSymlink(src: string, dest: string, type: ExecSymlink) {
  if (type === 'exec') {
    // If the src exists, shim directly.
    // If the src doesn't exist yet, create a temp src so cmd-shim doesn't explode.
    return fs.pathExists(src).then((exists) => {
      if (exists) {
        return cmdShim(src, dest)
      }

      return fs
        .outputFile(src, '')
        .then(() => cmdShim(src, dest))
        .then(
          // fs.remove() never rejects
          () => fs.remove(src),
          (err) =>
            fs.remove(src).then(() => {
              // clean up, but don't swallow error
              throw err
            }),
        )
    })
  }

  return createSymbolicLink(src, dest, type)
}

function shShim(src: string, dest: string, _type: Symlink) {
  const absTarget = path.resolve(path.dirname(dest), src)
  const scriptLines = [
    '#!/bin/sh',
    `chmod +x ${absTarget} && exec ${absTarget} "$@"`,
  ]
  return fs.writeFile(dest, scriptLines.join('\n'))
}

export { createSymlink }
