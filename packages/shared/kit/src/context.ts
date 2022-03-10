import type { WebBuilder } from '@growing-web/web-builder-types'
import { getContext } from 'unctx'

const webBuilderCtx = getContext<WebBuilder>('web-builder')

const useWebBuilder = (): WebBuilder => webBuilderCtx.use()!

export { webBuilderCtx, useWebBuilder }
