<template>
  <q-item
    item-rd
    clickable
    @click="onClick"
  >
    <q-item-section avatar>
      <a-avatar :avatar="perfs.userAvatar" />
    </q-item-section>
    <q-item-section>
      <q-item-label>
        {{ user.isLoggedIn ? user.name : '登录/注册' }}
      </q-item-label>
      <q-item-label caption>
        {{ user.isLoggedIn ? user.email : '登录以启用数据同步' }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { useObservable } from '@vueuse/rxjs'
import AAvatar from './AAvatar.vue'
import { db } from 'src/utils/db'
import { useLocalPerfStore } from 'src/stores/local-perf'

const user = useObservable(db.cloud.currentUser)
const { perfs } = useLocalPerfStore()

function onClick() {
  if (user.value.isLoggedIn) {
    // TODO
    db.cloud.logout()
  } else {
    db.cloud.login()
  }
}
</script>

<style scoped>

</style>
