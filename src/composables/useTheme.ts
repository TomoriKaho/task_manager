import { onUnmounted, ref, watch } from 'vue'
import { browserStorage, loadTheme, saveTheme } from '../lib/storage'

export function useTheme() {
  const stored = loadTheme(browserStorage)
  const media = window.matchMedia('(prefers-color-scheme: dark)')
  const system = media.matches ? 'dark' : 'light'
  const theme = ref<'light' | 'dark'>(stored ?? system)
  const themeWarning = ref<string | null>(null)
  let explicitlyChosen = stored !== null

  watch(theme, (value) => {
    document.documentElement.classList.toggle('dark', value === 'dark')
  }, { immediate: true })

  function systemChange(event: MediaQueryListEvent) {
    if (!explicitlyChosen) theme.value = event.matches ? 'dark' : 'light'
  }
  media.addEventListener('change', systemChange)
  onUnmounted(() => media.removeEventListener('change', systemChange))

  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    explicitlyChosen = true
    themeWarning.value = saveTheme(browserStorage, theme.value)
      ? null : '无法保存主题选择；刷新后可能恢复原设置。'
  }

  return { theme, themeWarning, toggleTheme }
}
