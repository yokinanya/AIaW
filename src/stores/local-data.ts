import { defineStore } from 'pinia'
import { persistentReactive } from 'src/composables/persistent-reactive'

interface LocalData {
  lastWorkspaceId: string
  noobAlertDismissed: boolean,
  tipDismissed: Record<string, boolean>
}

export const useLocalDataStore = defineStore('local-data', () => {
  const [data, ready] = persistentReactive<LocalData>('#local-data', {
    lastWorkspaceId: null,
    noobAlertDismissed: false,
    tipDismissed: {}
  })
  return { data, ready }
})
