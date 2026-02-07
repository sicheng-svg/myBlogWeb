# TypeScript 最佳实践指南

从类型安全到代码组织，全面介绍 TypeScript 在大型项目中的最佳实践。

## 类型安全

### 优先使用 `interface` 而非 `type`

```typescript
// 推荐
interface User {
  id: string;
  name: string;
  email: string;
}

// 仅在需要联合类型时使用 type
type Status = 'active' | 'inactive' | 'pending';
```

### 避免使用 `any`

```typescript
// 不推荐
function processData(data: any) { ... }

// 推荐
function processData<T extends Record<string, unknown>>(data: T) { ... }
```

## 代码组织

### 模块化设计

将相关的类型、函数和常量组织在同一个模块中：

```
src/
  features/
    auth/
      types.ts      // 类型定义
      api.ts        // API 调用
      hooks.ts      // React Hooks
      utils.ts      // 工具函数
```

## 实用工具类型

TypeScript 内置了许多有用的工具类型：

- `Partial<T>` — 所有属性可选
- `Required<T>` — 所有属性必填
- `Pick<T, K>` — 选取部分属性
- `Omit<T, K>` — 排除部分属性

## 总结

遵循这些最佳实践，可以让你的 TypeScript 代码更加健壮和可维护。
