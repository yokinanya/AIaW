<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
  >
    <q-card min-w="320px">
      <q-card-section>
        <div class="text-h6">
          模型服务充值
        </div>
      </q-card-section>
      <q-card-section p-0>
        <q-list>
          <q-item>
            <q-item-section>
              <q-item-label>
                充值额度（元）
              </q-item-label>
              <q-item-label caption>
                请输入 1 到 999 之间的整数
              </q-item-label>
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
              ￥{{ valid ? amount : '-' }}
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
          @click="order({ type: 'api-budget', amount })"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar'
import { useOrder } from 'src/composables/order'
import { computed, ref } from 'vue'

const amount = ref<number>(5)

defineEmits([
  ...useDialogPluginComponent.emits
])

const valid = computed(() => amount.value > 0 && amount.value < 1000 && amount.value % 1 === 0)
const loading = ref(false)

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const { order } = useOrder(loading, res => { onDialogOK(res) })
</script>
