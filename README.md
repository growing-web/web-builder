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

执行

```bash
pnpm run stub
```

然后直接对需要的模块进行编码，即可实时改变

## 调试

`playgrounds` 下提供一些框架测试，可以直接使用

e.g:

```bash
cd playgrounds/vue3

# 本地开发调试
pnpm run dev

# 打包测试
pnpm run build
```
