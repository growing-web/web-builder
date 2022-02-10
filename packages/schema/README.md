# @growing-web/web-builder-schema

## 设计

相关设计参考 RFC

- [RFC: 清单解析模块设计](https://github.com/growing-web/rfcs/discussions/3)

## 使用

```ts
import { read, parse, validate } from '@growing-web/web-builder-schema';

read({
     /**
     * 清单文件存放目录
     * @default process.cwd()
     */
    root?: string;

    /**
     * 清单文件名
     * @default growing-web.json
     */
    manifestFileName?: string;
})

parse({
     /**
     * 清单文件存放目录
     * @default process.cwd()
     */
    root?: string;

    /**
     * 清单文件名
     * @default growing-web.json
     */
    manifestFileName?: string;
})

/**
 * 根据清单格式对清单内容进行校验
 */
validate(/* schema */)

```
