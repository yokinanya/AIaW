import { defineStore } from 'pinia'
import { persistentReactive } from 'src/composables/persistent-reactive'

interface UserData {
  lastWorkspaceId: string
  noobAlertDismissed: boolean,
  tipDismissed: Record<string, boolean>
}

export const useUserDataStore = defineStore('user-data', () => {
  const [data, ready] = persistentReactive<UserData>('#user-data', {
    lastWorkspaceId: null,
    noobAlertDismissed: false,
    tipDismissed: {}
  })
  return { data, ready }
})
