<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    persistent
  >
    <q-card min-w="320px">
      <q-card-section>
        <div class="text-h6">
          支付
        </div>
      </q-card-section>
      <q-card-section
        p-0
        flex="~ col items-center"
      >
        <div>使用支付宝，扫码支付{{ price }}元</div>
        <vue-qrcode
          :value="props.qrCode"
          :options="{
            width: 240,
            color: {
              light: lightColor,
              dark: darkColor
            }
          }"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          flat
          text-err
          label="取消订单"
          @click="cancelOrder"
          :loading="cancelLoading"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent, useQuasar } from 'quasar'
import VueQrcode from '@chenfengyuan/vue-qrcode'
import { BudgetBaseURL } from 'src/utils/config'
import { db } from 'src/utils/db'
import { computed, onBeforeUnmount, ref } from 'vue'
import { useUiStateStore } from 'src/stores/ui-state'
import { hexFromArgb } from '@material/material-color-utilities'

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps<{
  orderId: string,
  qrCode: string,
  price: number
}>()

defineEmits([
  ...useDialogPluginComponent.emits
])

const cancelLoading = ref(false)

const $q = useQuasar()
async function cancelOrder() {
  cancelLoading.value = true
  try {
    const res = await fetch(`${BudgetBaseURL}/cancel-order`, {
      method: 'POST',
      body: JSON.stringify({ order_id: props.orderId }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${db.cloud.currentUser.value.accessToken}`
      }
    })
    if (!res.ok) throw new Error('Failed to cancel order')
    onDialogCancel()
    $q.notify({
      message: '订单已取消'
    })
  } catch (err) {
    console.error(err)
    $q.notify({
      message: '取消订单失败',
      color: 'negative'
    })
  } finally {
    cancelLoading.value = false
  }
}

async function checkOrderStatus() {
  try {
    const res = await fetch(`${BudgetBaseURL}/order-status`, {
      method: 'POST',
      body: JSON.stringify({ order_id: props.orderId }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (!res.ok) throw new Error('Failed to check order status')
    const body = await res.json()
    if (body.status === 'completed') {
      onDialogOK()
      $q.notify({
        message: '支付成功',
        color: 'positive'
      })
    } else if (body.status === 'cancelled') {
      onDialogCancel()
      $q.notify({
        message: '订单已取消'
      })
    }
  } catch (err) {
    console.error(err)
    $q.notify({
      message: '检查订单状态失败',
      color: 'negative'
    })
  }
}
const interval = setInterval(checkOrderStatus, 3000)
onBeforeUnmount(() => clearInterval(interval))

const uiStateStore = useUiStateStore()
const lightColor = computed(() => hexFromArgb(uiStateStore.colors['sur-c']))
const darkColor = computed(() => hexFromArgb(uiStateStore.colors['on-sur']))
</script>
