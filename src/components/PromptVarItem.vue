<template>
  <div flex>
    <div
      flex
      items-center
      flex-wrap
      gap-2
    >
      <q-input
        v-model="model.name"
        label="变量名"
        filled
        dense
        class="prompt-var-input-item"
      />
      <q-input
        v-model="model.label"
        label="标签"
        filled
        dense
        class="prompt-var-input-item"
      />
      <q-select
        v-model="model.type"
        label="类型"
        :options
        map-options
        emit-value
        filled
        dense
        class="prompt-var-input-item"
      />
      <q-select
        v-if="['select', 'multi-select'].includes(model.type)"
        v-model="model.options"
        label="选项"
        use-input
        use-chips
        multiple
        hide-dropdown-icon
        :input-debounce="0"
        new-value-mode="add-unique"
        filled
        dense
        class="prompt-var-input-item"
      />
      <prompt-var-input
        :prompt-var="{ ...model, label: '默认值' }"
        v-model="model.default"
        :input-props="{
          dense: true,
          filled: true
        }"
        class="prompt-var-input-item"
        component="input"
      />
    </div>
    <q-btn
      ml-2
      flat
      icon="sym_o_close"
      round
      dense
      @click="$emit('remove')"
    />
  </div>
</template>

<script setup lang="ts">
import { PromptVar } from 'src/utils/types'
import PromptVarInput from './PromptVarInput.vue'

const model = defineModel<PromptVar>()

defineEmits(['remove'])

const options = [
  { label: '文本', value: 'text' },
  { label: '数字', value: 'number' },
  { label: '开关', value: 'toggle' },
  { label: '选择', value: 'select' },
  { label: '多选', value: 'multi-select' }
]
</script>
<style lang="scss">
.prompt-var-input-item {
  flex-grow: 1;
  flex-basis: 100px;
}
</style>
