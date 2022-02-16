# Web Builder

## 环境

- Node.js > 16
- pnpm > 6

## 安装

```bash
# 安装依赖
pnpm install
```

安装完以后会自动关联所有 `monorepo` 仓库，无需手动进行 `pnpm link` 操作

## 开发

直接对需要的模块进行编码，即可实时改变

## 调试

`playgrounds` 下提供一些框架测试，可以直接使用

e.g:

```bash
cd playgrounds/vue3

# 本地开发调试
yarn dev

# 打包测试
yarn build
```
