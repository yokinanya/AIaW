import { useQuasar } from 'quasar'
import { useObservable } from '@vueuse/rxjs'
import { db } from 'src/utils/db'
import { watch } from 'vue'
import { dialogOptions } from 'src/utils/values'

export function useLoginDialogs() {
  const userInteraction = useObservable(db.cloud.userInteraction)
  const $q = useQuasar()

  watch(userInteraction, interaction => {
    if (!interaction) return
    if (interaction.type === 'email') {
      $q.dialog({
        title: '登录/注册',
        prompt: {
          model: '',
          type: 'email',
          label: 'Email'
        },
        cancel: true,
        persistent: true,
        ...dialogOptions
      }).onOk(email => {
        interaction.onSubmit({ email })
      })
    } else if (interaction.type === 'otp') {
      $q.dialog({
        title: 'OTP验证码',
        message: '请输入验证邮件中的OTP验证码',
        prompt: {
          model: '',
          type: 'text',
          label: 'OTP验证码'
        },
        cancel: true,
        persistent: true,
        ...dialogOptions
      }).onOk(otp => {
        interaction.onSubmit({ otp })
      }).onCancel(() => {
        interaction.onCancel()
      })
    } else if (interaction.type === 'logout-confirmation') {
      $q.dialog({
        title: '退出登录',
        message: '确定要退出登录吗？',
        cancel: true,
        persistent: true,
        ...dialogOptions
      }).onOk(() => {
        interaction.onSubmit({})
      }).onCancel(() => {
        interaction.onCancel()
      })
    } else if (interaction.type === 'message-alert') {
      for (const alert of interaction.alerts) {
        $q.notify({
          message: alert.message,
          color: alert.type === 'info' ? undefined : 'negative'
        })
      }
    }
  })
}
