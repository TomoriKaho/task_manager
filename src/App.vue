<script setup lang="ts">
import { ref, watch } from 'vue'
import { LayoutGrid, List, Moon, Plus, Sun } from 'lucide-vue-next'

type View = 'list' | 'board'
const view = ref<View>('list')
const theme = ref<'light' | 'dark'>(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
watch(theme, (value) => document.documentElement.classList.toggle('dark', value === 'dark'), { immediate: true })
</script>

<template>
  <div class="app-shell">
    <div class="workspace">
      <header class="topbar">
        <div class="topbar-main">
          <div class="brand"><span class="brand-mark"><List :size="19" :stroke-width="2.3" /></span><h1>任务</h1></div>
          <nav class="view-tabs" aria-label="视图切换">
            <button type="button" :class="{ active: view === 'list' }" :aria-current="view === 'list' ? 'page' : undefined" @click="view = 'list'"><List :size="17" />列表</button>
            <button type="button" :class="{ active: view === 'board' }" :aria-current="view === 'board' ? 'page' : undefined" @click="view = 'board'"><LayoutGrid :size="17" />看板</button>
          </nav>
          <button type="button" class="theme-toggle" :aria-label="theme === 'light' ? '切换深色模式' : '切换浅色模式'" @click="theme = theme === 'light' ? 'dark' : 'light'"><Sun :size="18" :class="{ selected: theme === 'light' }" /><Moon :size="18" :class="{ selected: theme === 'dark' }" /></button>
        </div>
      </header>
      <main class="main-content">
        <div class="page-actions">
          <div class="page-intro"><p class="eyeline">我的工作区</p><h2>{{ view === 'list' ? '任务列表' : '任务看板' }}</h2><p>{{ view === 'list' ? '集中查看和管理每一项任务。' : '拖动卡片，让进度一目了然。' }}</p></div>
          <button type="button" class="button-primary add-main" disabled title="下一里程碑开放"><Plus :size="18" />新建任务</button>
        </div>
        <section v-if="view === 'list'" class="list-view" aria-label="任务列表">
          <div class="list-toolbar"><div class="section-heading"><h2>全部任务</h2><span class="count-chip">0</span></div></div>
          <div class="list-empty"><span class="empty-icon"><List :size="26" :stroke-width="1.7" /></span><h3>还没有任务</h3><p>任务功能将在下一里程碑开放。</p></div>
        </section>
        <section v-else class="board-view" aria-label="任务看板">
          <div v-for="status in [{ key: 'todo', label: '待办' }, { key: 'doing', label: '进行中' }, { key: 'done', label: '完成' }]" :key="status.key" class="board-column" :class="`column-${status.key}`">
            <div class="column-header"><h2>{{ status.label }}</h2><span class="column-count">0</span></div>
            <div class="column-tasks"><div class="column-empty">暂无任务</div></div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>
