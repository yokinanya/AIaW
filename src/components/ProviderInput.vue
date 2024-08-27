<template>
  <q-select
    :options="providerOptions"
    emit-value
    map-options
  />
</template>

<script setup>
import { providerOptions } from 'src/utils/values'
</script>
