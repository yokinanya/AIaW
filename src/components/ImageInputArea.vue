<template>
  <div
    @click="imageInput.click()"
    @dragenter.prevent
    @dragover.prevent
    @drop.stop.prevent="onDrop"
    border="dashed 2px out"
    h="200px"
    flex
    items-center
    justify-center
    cursor-pointer
  >
    <div text="xl center out">
      点击选择图片<br>
      拖拽到此处<br>
      或者 Ctrl+V 粘贴
    </div>
    <input
      ref="imageInput"
      type="file"
      accept="image/*"
      @change="onInput"
      un-hidden
    >
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from 'vue'

const emit = defineEmits<{
  input: [File]
}>()
const imageInput = ref<HTMLInputElement>()

function onInput() {
  emit('input', imageInput.value.files[0])
}
function onDrop({ dataTransfer }) {
  for (const file of dataTransfer.files) {
    if (file.type.startsWith('image/')) {
      emit('input', file)
      break
    }
  }
}
function onPaste({ clipboardData }) {
  for (const file of clipboardData.files) {
    if (file.type.startsWith('image/')) {
      emit('input', file)
      break
    }
  }
}
addEventListener('paste', onPaste)
onUnmounted(() => removeEventListener('paste', onPaste))
</script>

<style scoped>

</style>
