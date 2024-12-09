import { useUserPerfsStore } from 'src/stores/user-perfs'
import { toRef } from 'vue'
import { useModel } from './model'

export function useSystemModel() {
  const { perfs } = useUserPerfsStore()
  return useModel(toRef(perfs, 'systemProvider'), toRef(perfs, 'systemModel'))
}
