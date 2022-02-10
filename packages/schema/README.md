# @growing-web/web-builder-schema

## Design

Related Design Reference RFCs

- [RFC: 工程清单技术标准](https://github.com/growing-web/rfcs/discussions/2)

## Usage

```ts
import { read, parse, validate } from '@growing-web/web-builder-schema';

read({
     /**
     * manifest file storage directory
     * @default process.cwd()
     */
    root?: string;

    /**
     * manifest filename
     * @default project-manifest.json
     */
    manifestFileName?: string;
})

parse({
     /**
     * manifest file storage directory
     * @default process.cwd()
     */
    root?: string;

    /**
     * manifest filename
     * @default growing-web.json
     */
    manifestFileName?: string;
})

/**
 * Check the content of the list according to the list format
 */
validate(/* schema */)
```
