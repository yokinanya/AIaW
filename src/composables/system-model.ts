import { useLocalPerfStore } from 'src/stores/local-perf'
import { toRef } from 'vue'
import { useModel } from './model'

export function useSystemModel() {
  const { perfs } = useLocalPerfStore()
  return useModel(toRef(perfs, 'systemProvider'), toRef(perfs, 'systemModel'))
}
