<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
  >
    <q-card min-w="320px">
      <q-card-section>
        <div class="text-h6">
          订阅云同步服务
        </div>
      </q-card-section>
      <q-card-section p-0>
        <q-list>
          <q-item>
            <q-item-section>
              订阅时长（月）
            </q-item-section>
            <q-item-section side>
              <q-input
                class="w-50px"
                v-model.number="amount"
                type="number"
              />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              应付金额
            </q-item-section>
            <q-item-section side>
              ￥{{ valid ? (amount * SyncServicePrice).toFixed(2) : '-' }}
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              支付方式
            </q-item-section>
            <q-item-section side>
              目前仅支持支付宝
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          flat
          color="primary"
          label="取消"
          @click="onDialogCancel"
        />
        <q-btn
          flat
          color="primary"
          label="下单"
          :loading
          :disable="!valid"
          @click="order({ type: 'sync-service', amount })"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar'
import { useOrder } from 'src/composables/order'
import { SyncServicePrice } from 'src/utils/config'
import { computed, ref } from 'vue'

defineEmits([
  ...useDialogPluginComponent.emits
])

const amount = ref<number>(1)

const valid = computed(() => amount.value > 0 && amount.value < 100 && amount.value % 1 === 0)
const loading = ref(false)

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const { order } = useOrder(loading, onDialogOK)
</script>
