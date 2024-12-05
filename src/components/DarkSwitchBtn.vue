<template>
  <q-btn
    flat
    dense
    round
    :icon="curr.icon"
    :title="curr.title"
    @click="switchDark"
  />
</template>

<script setup lang="ts">
import { useLocalPerfStore } from 'src/stores/local-perf'
import { computed } from 'vue'

const { perfs } = useLocalPerfStore()

const options = new Map()
options.set('auto', { title: '切换至深色', icon: 'sym_o_dark_mode', next: true })
options.set(true, { title: '切换至浅色', icon: 'sym_o_light_mode', next: false })
options.set(false, { title: '切换至自动', icon: 'sym_o_brightness_auto', next: 'auto' })

const curr = computed(() => options.get(perfs.darkMode))

function switchDark() {
  perfs.darkMode = curr.value.next
}
</script>
