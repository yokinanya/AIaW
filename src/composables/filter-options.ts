import { ref } from 'vue'

export function useFilterOptions(options: string[]) {
  const filteredOptions = ref([])
  function filterFn(val, update, abort) {
    if (!val) {
      abort()
      return
    }
    update(() => {
      filteredOptions.value = options.filter(v => v.toLowerCase().includes(val.toLowerCase()))
    })
  }
  return {
    filteredOptions,
    filterFn
  }
}
