<template><div /></template>

<script setup lang="ts">
import { until } from '@vueuse/core'
import { useQuasar } from 'quasar'
import { useLocalPerfStore } from 'src/stores/local-perf'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const localPerfStore = useLocalPerfStore()
const $q = useQuasar()

until(() => localPerfStore.ready).toBeTruthy().then(() => {
  try {
    const provider = JSON.parse(route.query.provider as string)
    for (const key in provider) {
      localPerfStore.perfs.provider[key] = provider[key]
    }
    $q.notify({
      message: '已设置服务商',
      color: 'positive'
    })
  } catch (e) {
    console.error(e)
    $q.notify({
      message: '设置服务商失败',
      color: 'negative'
    })
  } finally {
    router.replace('/')
  }
})
</script>
