import { Ref, ref, watch } from 'vue'
import { db } from 'src/utils/db'
import { useFileURL } from './file-url'

export function useAvatarImage(imageId: Ref<string>) {
  const image = ref(null)
  watch(imageId, to => {
    if (to) {
      db.avatarImages.get(to).then(i => {
        image.value = i
      })
    } else {
      image.value = null
    }
  }, { immediate: true })
  return useFileURL(image)
}
