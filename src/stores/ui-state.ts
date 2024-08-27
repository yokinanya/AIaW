import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStateStore = defineStore('ui-state', () => {
  const mainDrawerOpen = ref(false)
  function toggleMainDrawer() {
    mainDrawerOpen.value = !mainDrawerOpen.value
  }
  return { mainDrawerOpen, toggleMainDrawer }
})
