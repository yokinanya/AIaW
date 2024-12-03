import { useQuasar } from 'quasar'
import { BudgetBaseURL } from 'src/utils/config'
import { db } from 'src/utils/db'
import { OrderItem } from 'src/utils/types'
import { Ref } from 'vue'

export function useOrder(loading: Ref<boolean>, onDialogOK: (res) => void) {
  const $q = useQuasar()
  async function order(item: OrderItem) {
    try {
      loading.value = true
      const res = await fetch(`${BudgetBaseURL}/order`, {
        method: 'POST',
        body: JSON.stringify({
          item
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${db.cloud.currentUser.value.accessToken}`
        }
      })
      if (!res.ok) throw new Error('Failed to order')
      const body = await res.json()
      onDialogOK({
        orderId: body.order_id,
        qrCode: body.qr_code,
        price: body.price
      })
    } catch (error) {
      console.error(error)
      $q.notify({
        message: '下单失败',
        color: 'negative'
      })
    } finally {
      loading.value = false
    }
  }
  return {
    order
  }
}
