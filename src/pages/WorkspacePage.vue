<template>
  <template v-if="workspace">
    <router-view @toggle-drawer="drawerOpen = !drawerOpen" />
    <q-drawer
      show-if-above
      bg-sur-c-low
      :width="250"
      :breakpoint="drawerBreakpoint"
      side="right"
      v-model="drawerOpen"
    >
      <div
        h="48px"
        p-2
        flex
        items-center
      >
        <q-space />
        <q-btn
          flat
          dense
          round
          icon="sym_o_home"
          :to="`/workspaces/${id}`"
          :class="{'icon-fill': $route.path === `/workspaces/${id}`}"
        />
        <q-btn
          flat
          dense
          round
          icon="sym_o_settings"
          :to="`/workspaces/${id}/settings`"
          :class="{'icon-fill': $route.path === `/workspaces/${id}/settings`}"
        />
      </div>
      <div>
        <q-expansion-item
          label="助手"
          header-class="text-lg"
          default-opened
        >
          <assistant-list
            my-2
            :workspace-id="workspace.id"
          />
        </q-expansion-item>
        <q-separator />
        <q-expansion-item
          label="对话"
          header-class="text-lg"
          default-opened
        >
          <dialog-list />
        </q-expansion-item>
      </div>
    </q-drawer>
  </template>
  <error-not-found
    v-else
    drawer-toggle
  />
</template>

<script setup lang="ts">
import { computed, provide, ref, watch } from 'vue'
import AssistantList from 'src/components/AssistantList.vue'
import DialogList from 'src/components/DialogList.vue'
import { useWorkspacesStore } from 'src/stores/workspaces'
import { useLiveQueryWithDeps } from 'src/composables/live-query'
import { db } from 'src/utils/db'
import { Workspace, Dialog } from 'src/utils/types'
import { useLocalDataStore } from 'src/stores/local-data'
import { useQuasar } from 'quasar'
import ErrorNotFound from 'src/pages/ErrorNotFound.vue'

const props = defineProps<{
  id: string
}>()

const workspacesStore = useWorkspacesStore()

const workspace = computed(() => workspacesStore.workspaces.find(item => item.id === props.id) as Workspace)
const dialogs = useLiveQueryWithDeps(() => props.id, () => db.dialogs.where('workspaceId').equals(props.id).toArray(), { initialValue: [] as Dialog[] })

provide('workspace', workspace)
provide('dialogs', dialogs)

const { data } = useLocalDataStore()
watch(workspace, val => {
  if (val) {
    data.lastWorkspaceId = val.id
  }
}, { immediate: true })

const drawerOpen = ref(false)

const drawerBreakpoint = 960
const $q = useQuasar()
const rightDrawerAbove = computed(() => $q.screen.width > drawerBreakpoint)
provide('rightDrawerAbove', rightDrawerAbove)
</script>
