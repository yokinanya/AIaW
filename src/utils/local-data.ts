import { localReactive } from 'src/composables/local-reactive'

interface LocalData {
  lastReloadTimestamp: number | null
  visited: boolean
}

const localData = localReactive<LocalData>('local-data', {
  lastReloadTimestamp: null,
  visited: false
})

export { localData }
