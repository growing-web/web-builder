import type { WebBuilder } from '@growing-web/web-builder-types'
import { getContext } from 'unctx'

export const webBuilderCtx = getContext<WebBuilder>('web-builder')

export const useWebBuilder = webBuilderCtx.use
