<template>
  <router-view />
</template>

<script setup lang="ts">
import { useLoginDialogs } from './composables/login-dialogs'
import { useSetTheme } from './composables/set-theme'

defineOptions({
  name: 'App'
})

useSetTheme()
useLoginDialogs()

</script>
