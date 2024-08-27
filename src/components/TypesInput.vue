<template>
  <template v-if="type === 'string'">
    <q-select
      v-if="options"
      v-model="model"
      :options
      :dense
      :filled
      :outlined
      :label
      :hint
      :class="$attrs.class"
    />
    <q-input
      v-else
      v-model="model"
      :dense
      :filled
      :outlined
      :label
      :hint
      :class="$attrs.class"
    />
  </template>
  <template v-else-if="type === 'array'">
    <q-select
      v-if="options"
      v-model="model"
      multiple
      :options
      :dense
      :filled
      :outlined
      :label
      :hint
      :class="$attrs.class"
    />
    <q-select
      v-else
      v-model="model"
      use-input
      use-chips
      multiple
      hide-dropdown-icon
      input-debounce="0"
      new-value-mode="add"
      class="input-item"
      :dense
      :filled
      :outlined
      :label
      :hint
      :class="$attrs.class"
    />
  </template>

  <q-input
    v-else-if="type === 'number'"
    v-model.number="model"
    type="number"
    :dense
    :filled
    :outlined
    :label
    :hint
    :class="$attrs.class"
  />
  <q-toggle
    v-else-if="type === 'boolean'"
    v-model="model"
    left-label
    :label
    :class="$attrs.class"
  />
</template>

<script setup lang="ts">
defineProps<{
  type: 'string' | 'array' | 'number' | 'boolean'
  options?: string[]
  dense?: boolean
  filled?: boolean
  outlined?: boolean
  label?: string
  hint?: string
}>()
const model = defineModel<any>()
</script>
