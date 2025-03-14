import { ref, watch } from 'vue'
import { usePreferredDark } from '@vueuse/core'

export function useTheme() {
  const preferredDark = usePreferredDark()
  const isDark = ref(preferredDark.value)

  function toggleTheme() {
    isDark.value = !isDark.value
  }

  watch(isDark, (value) => {
    document.documentElement.classList.toggle('dark', value)
  }, { immediate: true })

  return {
    isDark,
    toggleTheme,
  }
}