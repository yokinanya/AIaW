<template>
  <q-layout view="lHr LpR lFf">
    <q-drawer
      v-model="uiStore.mainDrawerOpen"
      show-if-above
      :width="250"
      :breakpoint="1200"
      bg-sur-c
      flex
      flex-col
    >
      <div
        text-xl
        px-4
        pt-4
      >
        <svg
          fill-on-sur-var
          h="24px"
          viewBox="0 0 636 86"
        >
          <use
            xlink:href="/banner.svg#default"
          />
        </svg>
      </div>
      <q-separator spaced />
      <div
        px-4
        py-2
        text-sec
      >
        工作区
      </div>
      <workspace-nav mt-2 />
      <q-list
        mt-a
        mb-2
      >
        <q-item
          clickable
          to="/assistants"
          active-class="bg-sec-c text-on-sec-c icon-fill"
          item-rd
        >
          <q-item-section avatar>
            <q-icon name="sym_o_robot_2" />
          </q-item-section>
          <q-item-section>
            助手
          </q-item-section>
        </q-item>
        <q-item
          clickable
          to="/plugins"
          active-class="bg-sec-c text-on-sec-c icon-fill"
          item-rd
        >
          <q-item-section avatar>
            <q-icon name="sym_o_extension" />
          </q-item-section>
          <q-item-section>
            插件
          </q-item-section>
        </q-item>
        <q-item
          clickable
          to="/settings"
          active-class="bg-sec-c text-on-sec-c icon-fill"
          item-rd
        >
          <q-item-section avatar>
            <q-icon name="sym_o_settings" />
          </q-item-section>
          <q-item-section>
            设置
          </q-item-section>
        </q-item>
        <q-separator spaced />
        <user-item />
      </q-list>
    </q-drawer>
    <router-view />
  </q-layout>
</template>

<script setup>
import { until } from '@vueuse/core'
import UserItem from 'src/components/UserItem.vue'
import WorkspaceNav from 'src/components/WorkspaceNav.vue'
import { useLocalDataStore } from 'src/stores/local-data'
import { useUiStateStore } from 'src/stores/ui-state'
import { useRoute, useRouter } from 'vue-router'

defineOptions({
  name: 'MainLayout'
})

const uiStore = useUiStateStore()

const { data } = useLocalDataStore()
const route = useRoute()
const router = useRouter()

until(() => data.lastWorkspaceId).toBeTruthy().then(() => {
  if (route.path === '/' && data.lastWorkspaceId) {
    router.push(`/workspaces/${data.lastWorkspaceId}`)
  }
})
</script>
