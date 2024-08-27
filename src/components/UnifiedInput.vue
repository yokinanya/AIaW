<template>
  <types-input
    v-if="component === 'input'"
    :type
    :options
    :label
    :hint="description"
    v-model="model"
  />
  <q-item v-else-if="component === 'item'">
    <q-item-section>
      <q-item-label>
        {{ label }}
      </q-item-label>
      <q-item-label
        v-if="description"
        caption
      >
        {{ description }}
      </q-item-label>
    </q-item-section>
    <q-item-section side>
      <types-input
        :type
        :options
        v-model="model"
        dense
        filled
        class="xs:w-150px sm:w-250px"
      />
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import TypesInput from './TypesInput.vue'

defineProps<{
  type: 'string' | 'number' | 'boolean' | 'array'
  component: 'input' | 'item'
  options?: string[]
  label?: string
  description?: string
}>()

const model = defineModel<string | number | boolean | string[]>()
</script>
