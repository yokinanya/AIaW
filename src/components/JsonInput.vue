<template>
  <template
    v-for="(sch, key) in schema.properties"
    :key="key"
  >
    <json-input
      v-if="sch.type === 'object'"
      :schema="sch as PluginSchema"
      :prefix="key as string"
      :component
      v-model="model[key] as unknown as Model"
    />
    <unified-input
      v-else
      :type="sch.type as any"
      :options="sch.enum as any"
      :label="sch.title || key as string"
      :description="sch.description"
      :component
      v-model="model[key] as any"
    />
  </template>
</template>

<script setup lang="ts">
import { PluginSchema } from '@lobehub/chat-plugin-sdk'
import UnifiedInput from './UnifiedInput.vue'

defineProps<{
  schema: PluginSchema
  prefix?: string
  dense?: boolean
  component: 'input' | 'item'
}>()

interface Model {
  [key: string]: string | number | boolean | string[]
}

const model = defineModel<Model>()
model.value ??= {}
</script>
