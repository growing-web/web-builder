import type { WebBuilderMode } from '@growing-web/web-builder-types'

export abstract class AbstractAdapter<T> {
  abstract configAdapter(mode: WebBuilderMode): Promise<T>
}
