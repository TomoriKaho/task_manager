# 任务管理系统

基于 Vue 3、Vite、TypeScript、Tailwind CSS 的单用户任务管理应用。当前里程碑已完成任务列表和增删改查；本地持久化与看板拖拽将在后续里程碑完成。

## 运行

```bash
npm install
npm run dev
```

浏览器打开终端给出的本地地址。执行 `npm run build` 构建生产版本，`npm run test` 运行单元测试，`npm run typecheck` 检查类型。

## 功能

- 新建、查看、编辑和删除任务；标题必填，描述选填。
- 任务状态为待办、进行中、完成；优先级为高、中、低。
- 列表支持标题与描述搜索，桌面端使用表格，手机端使用卡片。
- 深色模式可一键切换，首次打开时跟随系统配色。

当前任务仅保存在页面内存中，刷新后会清空。下一里程碑将接入浏览器 `localStorage`。

## 目录

```text
src/
  components/    任务列表、编辑与删除弹窗
  composables/    任务状态
  lib/            任务操作
  types/          任务类型与选项
  App.vue         页面布局与交互入口
  style.css       Tailwind 与界面样式
```
