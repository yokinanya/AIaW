<template>
  <q-list>
    <q-item
      clickable
      @click="addItem"
      text-sec
      item-rd
    >
      <q-item-section
        avatar
        min-w-0
      >
        <q-icon name="sym_o_add_comment" />
      </q-item-section>
      <q-item-section>
        新建对话
      </q-item-section>
    </q-item>
    <div p="x-4 y-2">
      <q-input
        dense
        outlined
        v-model="filter"
        clearable
        placeholder="搜索对话..."
      />
    </div>
    <q-item
      v-for="dialog in filteredDialogs"
      :key="dialog.id"
      clickable
      :to="`/workspaces/${workspace.id}/dialogs/${dialog.id}`"
      active-class="bg-sec-c text-on-sec-c"
      item-rd
    >
      <q-item-section>
        {{ dialog.name }}
      </q-item-section>
      <q-menu
        context-menu
      >
        <q-list style="min-width: 100px">
          <q-item
            clickable
            v-close-popup
            @click="renameItem(dialog.id, dialog.name)"
            min-h-0
          >
            <q-item-section>修改标题</q-item-section>
          </q-item>
          <q-item
            clickable
            v-close-popup
            @click="$router.push(`/workspaces/${workspace.id}/dialogs/${dialog.id}#genTitle`)"
            min-h-0
          >
            <q-item-section>总结标题</q-item-section>
          </q-item>
          <q-item
            clickable
            v-close-popup
            @click="moveItem(dialog.id)"
            min-h-0
          >
            <q-item-section>移动至</q-item-section>
          </q-item>
          <q-item
            clickable
            v-close-popup
            @click="deleteItem(dialog.id)"
            min-h-0
            hover:text-err
          >
            <q-item-section>删除</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar'
import { db } from 'src/utils/db'
import { genId, caselessIncludes } from 'src/utils/functions'
import { Dialog, Workspace } from 'src/utils/types'
import { dialogOptions } from 'src/utils/values'
import { computed, inject, ref, Ref } from 'vue'
import { useRouter } from 'vue-router'
import SelectWorkspaceDialog from './SelectWorkspaceDialog.vue'

const workspace: Ref<Workspace> = inject('workspace')
const dialogs: Ref<Dialog[]> = inject('dialogs')
const filter = ref(null)
const filteredDialogs = computed(() => {
  return dialogs.value.filter(d => !filter.value || caselessIncludes(d.name, filter.value)).reverse()
})

const $q = useQuasar()

const router = useRouter()
async function addItem() {
  const id = genId()
  const messageId = genId()
  await db.transaction('rw', db.dialogs, db.messages, async () => {
    await db.dialogs.add({
      id,
      workspaceId: workspace.value.id,
      name: '新对话',
      msgTree: { $root: [messageId], [messageId]: [] },
      msgRoute: [],
      assistantId: workspace.value.defaultAssistantId,
      inputVars: {}
    })
    await db.messages.add({
      id: messageId,
      dialogId: id,
      workspaceId: workspace.value.id,
      type: 'user',
      contents: [{
        type: 'user-message',
        text: '',
        items: []
      }],
      status: 'inputing'
    })
  })

  router.push(`/workspaces/${workspace.value.id}/dialogs/${id}`)
}

function renameItem(id, oldName) {
  $q.dialog({
    title: '重命名',
    message: '请输入新名称：',
    prompt: {
      model: oldName,
      type: 'text',
      isValid: v => v.trim() && v !== oldName
    },
    cancel: true,
    ...dialogOptions
  }).onOk(newName => {
    db.dialogs.update(id, { name: newName.trim() })
  })
}
function moveItem(id) {
  $q.dialog({
    component: SelectWorkspaceDialog,
    componentProps: {
      accept: 'workspace'
    }
  }).onOk(workspaceId => {
    db.dialogs.update(id, { workspaceId })
  })
}
function deleteItem(id) {
  $q.dialog({
    title: '删除对话',
    message: '确定要删除对话吗？',
    cancel: true,
    ok: {
      label: '删除',
      color: 'err',
      flat: true
    },
    ...dialogOptions
  }).onOk(() => {
    db.transaction('rw', db.dialogs, db.messages, async () => {
      await db.dialogs.delete(id)
      await db.messages.where('dialogId').equals(id).delete()
    })
  })
}
</script>
