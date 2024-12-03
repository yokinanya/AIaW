<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
  >
    <q-card
      important:md:max-w="720px"
      important:lg:max-w="960px"
      min-w="300px"
    >
      <q-card-section bg-sur-c-low>
        <div class="text-h6">
          {{ file.name }}
        </div>
      </q-card-section>
      <q-card-section
        p-0
        bg-sur-c-low
      >
        <div v-if="file.contentText">
          <md-preview
            :model-value="markdown"
            preview-theme="vuepress"
            :theme="$q.dark.isActive ? 'dark' : 'light'"
            :auto-fold-threshold="Infinity"
            bg-sur-c-low
            max-h="80vh"
          />
        </div>
        <div v-if="file.contentBuffer">
          <q-list>
            <q-item>
              <q-item-section>
                文件大小
              </q-item-section>
              <q-item-section side>
                {{ sizeStr(file.contentBuffer.byteLength) }}
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                文件类型
              </q-item-section>
              <q-item-section side>
                {{ file.mimeType }}
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-card-section>
      <q-card-actions
        align="right"
        bg-sur-c-low
      >
        <q-btn
          flat
          color="primary"
          label="确定"
          @click="onDialogOK"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { MdPreview } from 'md-editor-v3'
import { useDialogPluginComponent } from 'quasar'
import { wrapCode, wrapQuote } from 'src/utils/functions'
import { StoredItem } from 'src/utils/types'
import { codeExtensions } from 'src/utils/values'
import { computed } from 'vue'

const props = defineProps<{
  file: StoredItem
}>()

defineEmits([
  ...useDialogPluginComponent.emits
])

const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent()

function sizeStr(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  else return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

const markdown = computed(() => {
  const { file } = props
  if (file.type === 'quote') return wrapQuote(file.contentText)
  const splits = file.name.split('.')
  if (splits.length < 2) return file.contentText
  const ext = splits.at(-1)
  return codeExtensions.includes(ext)
    ? wrapCode((file.contentText), ext)
    : (file.contentText)
})
</script>
