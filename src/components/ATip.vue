<template>
  <div
    v-if="!dismissed"
    class="bg-ter-c text-on-ter-c n-tip py-2 px-4 rd"
    :class="{ float, 'shadow-1': float, dense }"
  >
    <template v-if="dense">
      <div class="top-row">
        <span style="font-weight: 500;">TIP</span>
        <div class="spacer" />
        <q-btn
          flat
          label="不再提示"
          @click="dismiss"
        />
      </div>
      <div class="tip-text mb-2">
        <slot />
      </div>
    </template>
    <template v-else>
      <q-icon
        name="sym_o_lightbulb"
        size="sm"
      />
      <div class="tip-text ml-2">
        <slot />
      </div>
      <q-btn
        flat
        class="ml-2"
        label="不再提示"
        @click="dismiss"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { Screen } from 'quasar'
import { useLocalDataStore } from 'src/stores/local-data'
import { computed } from 'vue'

const props = defineProps<{
  tipKey: string
  float?: boolean
  long?: boolean
}>()

const { data } = useLocalDataStore()
const dismissed = data.tipDismissed[props.tipKey]
function dismiss() {
  data.tipDismissed[props.tipKey] = true
}
const dense = computed(() => Screen.xs && props.long)
</script>

<style lang="scss" scoped>
.n-tip {
  display: flex;

  &.float {
    position: absolute;
    z-index: 2;
  }

  .q-btn {
    flex-shrink: 0;
    padding: 4px 8px;
  }

  &:not(.dense) {
    align-items: center;

    .tip-text {
      flex-grow: 1;
    }
  }

  &.dense {
    flex-direction: column;

    .top-row {
      display: flex;
      align-items: center;

      .spacer {
        flex-grow: 1;
      }
    }
  }
}
</style>
