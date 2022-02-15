import type { UserConfig, UserConfigExport } from '@growing-web/web-builder'

export default ({ mode, bundlerType }: UserConfigExport): UserConfig => {
  return {
    server: {
      https: true,
      mkcert: true,
      open: false,
    },
  }
}
