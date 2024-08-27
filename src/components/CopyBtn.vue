<template>
  <q-btn
    :icon="icon"
    @click="copy"
    title="复制"
  />
</template>
<script setup>
import { copyToClipboard, Notify } from 'quasar'
import { ref } from 'vue'

const props = defineProps({
  value: {
    type: String,
    required: true
  }
})

const icon = ref('sym_o_content_copy')

function copy() {
  copyToClipboard(props.value).then(() => {
    icon.value = 'sym_o_check'
    setTimeout(() => {
      icon.value = 'sym_o_content_copy'
    }, 2000)
  }).catch(() => {
    Notify.create({
      message: '复制失败',
      color: 'negative'
    })
  })
}
</script>
