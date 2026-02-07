# 构建高性能 Web 应用

探索现代 Web 应用性能优化的核心策略。

## 代码分割

使用动态 `import()` 实现按需加载：

```javascript
// 路由级别的代码分割
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));
```

## 懒加载

### 图片懒加载

```html
<img src="image.jpg" loading="lazy" alt="描述" />
```

### 组件懒加载

```jsx
import { Suspense, lazy } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

## 缓存策略

| 策略 | 适用场景 | 有效期 |
|------|---------|--------|
| 强缓存 | 静态资源（JS/CSS） | 长期 |
| 协商缓存 | HTML 文件 | 每次验证 |
| Service Worker | 离线应用 | 自定义 |

## 渲染优化

1. **虚拟列表**：处理大量数据时使用虚拟滚动
2. **防抖节流**：优化频繁触发的事件
3. **Web Worker**：将计算密集型任务移至后台线程

## 总结

性能优化是一个持续的过程，需要在开发过程中不断关注和改进。
