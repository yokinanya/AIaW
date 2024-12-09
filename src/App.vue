<template>
  <router-view />
</template>

<script setup lang="ts">
import { useFirstVisit } from './composables/first-visit'
import { useLoginDialogs } from './composables/login-dialogs'
import { useSetTheme } from './composables/set-theme'

defineOptions({
  name: 'App'
})

useSetTheme()
useLoginDialogs()
useFirstVisit()

</script>
