import { useQuasar } from 'quasar'
import { db } from 'src/utils/db'
import { localData } from 'src/utils/local-data'
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export function useFirstVisit() {
  const $q = useQuasar()
  const route = useRoute()
  const router = useRouter()
  onMounted(() => {
    if (route.path === '/set-provider') {
      localData.visited = true
      return
    }
    if (!localData.visited) {
      $q.dialog({
        title: '欢迎使用 AI as Workspace',
        message: 'AIaW 是全功能、轻量级、可拓展的 AI 客户端。<br><br>为了使用 AI 模型，你需要<b>配置服务商（API）</b>或者<b>登录</b>。<br>登录之后，还可以使用跨设备实时云同步功能。',
        html: true,
        cancel: '配置服务商',
        persistent: true,
        ok: '登录'
      }).onCancel(() => {
        router.push('/settings')
        localData.visited = true
      }).onOk(() => {
        db.cloud.login()
        localData.visited = true
      })
    }
  })
}
