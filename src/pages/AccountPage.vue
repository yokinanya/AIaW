<template>
  <q-header
    bg-sur-c-low
    text-on-sur
  >
    <q-toolbar>
      <q-btn
        flat
        dense
        round
        icon="sym_o_menu"
        @click="uiStateStore.mainDrawerOpen = !uiStateStore.mainDrawerOpen"
      />
      <q-toolbar-title>
        账号
      </q-toolbar-title>
    </q-toolbar>
  </q-header>
  <q-page-container>
    <q-page
      pb-2
      v-if="user.license"
      max-w="1000px"
      mx-a
    >
      <q-list>
        <q-item-label header>
          信息
        </q-item-label>
        <q-item>
          <q-item-section>
            电子邮箱
          </q-item-section>
          <q-item-section side>
            {{ user.email }}
          </q-item-section>
        </q-item>
        <q-separator spaced />
        <q-item-label header>
          云同步
        </q-item-label>
        <q-item>
          <q-item-section>
            <q-item-label caption>
              跨设备实时云同步服务，能够同步工作区、对话、助手、设置、插件等所有数据。价格为{{ SyncServicePrice }}元/月
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label>
              状态
            </q-item-label>
            <q-item-label caption>
              {{ licenseStatus }}
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="user.license.type === 'eval'">
          <q-item-section>
            <q-item-label>
              试用中
            </q-item-label>
            <q-item-label caption>
              剩余试用天数：{{ user.license.evalDaysLeft }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn
              unelevated
              label="订阅"
              bg-pri-c
              text-on-pri-c
              @click="subscribeDialog"
            />
          </q-item-section>
        </q-item>
        <q-item v-else-if="user.license.type === 'prod'">
          <q-item-section>
            <q-item-label>
              已订阅
            </q-item-label>
            <q-item-label caption>
              有效期至 {{ user.license.validUntil.toLocaleString() }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn
              unelevated
              bg-pri-c
              text-on-pri-c
              label="续订"
              @click="subscribeDialog"
            />
          </q-item-section>
        </q-item>
        <q-separator spaced />
        <q-item-label header>
          模型服务
        </q-item-label>
        <q-item>
          <q-item-section>
            <q-item-label caption>
              一站式地使用不同服务商的各种先进模型，包括 gpt-4o、claude-3-5-sonnet、o1-mini 等，无需配置。额度随用随充，永久有效。按照官方API原价扣费（按USD/CNY=7计算）。<router-link
                to="/model-pricing"
                pri-link
              >
                模型价格
              </router-link>
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label>
              状态
            </q-item-label>
            <q-item-label caption>
              {{ !perfs.provider && user.isLoggedIn ? '正在使用（作为全局默认服务商）' : '未使用（已配置全局自定义服务商）' }}
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label>
              剩余额度
            </q-item-label>
            <q-item-label caption>
              <span v-if="llmBalance">￥{{ llmBalance }}</span>
              <span v-else>-</span>
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn
              unelevated
              bg-pri-c
              text-on-pri-c
              label="充值"
              @click="topupDialog"
            />
          </q-item-section>
        </q-item>
        <template v-if="user.data.orderHistory?.length">
          <q-separator spaced />
          <q-item-label header>
            历史订单
          </q-item-label>
          <q-table
            flat
            card-class="bg-sur"
            hide-bottom
            :rows="[...user.data.orderHistory].reverse()"
            :columns="orderHistoryColumns"
            :pagination="{ rowsPerPage: Infinity }"
            v-if="user.data.orderHistory?.length"
          />
        </template>
        <q-separator spaced />
        <q-item
          clickable
          v-ripple
          @click="logout"
        >
          <q-item-section avatar>
            <q-icon name="sym_o_logout" />
          </q-item-section>
          <q-item-section>
            退出登录
          </q-item-section>
        </q-item>
      </q-list>
    </q-page>
  </q-page-container>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useUiStateStore } from 'src/stores/ui-state'
import { useObservable } from '@vueuse/rxjs'
import { db } from 'src/utils/db'
import { useQuasar } from 'quasar'
import SubscribeDialog from 'src/components/SubscribeDialog.vue'
import { LitellmBaseURL, SyncServicePrice, UsdToCnyRate } from 'src/utils/config'
import TopupDialog from 'src/components/TopupDialog.vue'
import { useRouter } from 'vue-router'
import PayDialog from 'src/components/PayDialog.vue'
import { useUserPerfsStore } from 'src/stores/user-perfs'

const user = useObservable(db.cloud.currentUser)
const router = useRouter()
db.on('ready', () => {
  if (!user.value.isLoggedIn) {
    router.replace('/')
    db.cloud.login()
  } else {
    refreshLlmBalance()
  }
})
const licenseStatus = computed(() => {
  switch (user.value.license.status) {
    case 'ok': return '已启用'
    case 'expired': return '已过期'
    case 'deactivated': return '已停用'
    default: return '未知'
  }
})
const uiStateStore = useUiStateStore()

const $q = useQuasar()
function subscribeDialog() {
  $q.dialog({
    component: SubscribeDialog
  }).onOk(res => {
    $q.dialog({
      component: PayDialog,
      componentProps: res
    }).onOk(() => {
      db.cloud.sync()
    })
  })
}
function topupDialog() {
  $q.dialog({
    component: TopupDialog
  }).onOk(res => {
    $q.dialog({
      component: PayDialog,
      componentProps: res
    }).onOk(() => {
      refreshLlmBalance()
    })
  })
}

async function logout() {
  await db.cloud.logout()
  router.replace('/')
}

const llmBalance = ref(null)
async function refreshLlmBalance() {
  const resp = await fetch(`${LitellmBaseURL}/key/info`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${user.value.data.apiKey}`
    }
  })
  const { info, error } = await resp.json()
  if (resp.status === 400 && error.type === 'budget_exceeded') {
    llmBalance.value = '0'
    return
  }
  llmBalance.value = ((info.max_budget - info.spend) * UsdToCnyRate).toFixed(4)
}

const itemTypes = {
  'sync-service': '云同步服务',
  'api-budget': '模型额度'
}
const orderHistoryColumns = [
  { name: 'orderId', label: '订单号', field: 'orderId', align: 'left' as const },
  { name: 'createdAt', label: '支付时间', field: 'timestamp', format: (val: string) => new Date(val).toLocaleString() },
  { name: 'type', label: '类型', field: row => row.item.type, format: val => itemTypes[val] },
  { name: 'amount', label: '数量', field: row => row.item.amount }
]

const { perfs } = useUserPerfsStore()
</script>
