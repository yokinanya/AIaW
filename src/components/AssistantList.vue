<template>
  <q-list>
    <q-item
      v-for="assistant in assistants"
      :key="assistant.id"
      clickable
      :to="getLink(assistant.id)"
      active-class="bg-sec-c text-on-sec-c"
      item-rd
    >
      <q-item-section avatar>
        <a-avatar
          size="md"
          :avatar="assistant.avatar"
        />
      </q-item-section>
      <q-item-section>
        {{ assistant.name }}
      </q-item-section>
      <q-menu
        context-menu
      >
        <q-list style="min-width: 100px">
          <q-item
            clickable
            v-close-popup
            v-if="workspaceId !== '$root'"
            @click="move(assistant.id, '$root')"
            min-h-0
          >
            <q-item-section>移至全局</q-item-section>
          </q-item>
          <q-item
            clickable
            v-close-popup
            @click="moveToWorkspace(assistant.id)"
            min-h-0
          >
            <q-item-section>移至工作区</q-item-section>
          </q-item>
          <q-item
            clickable
            v-close-popup
            @click="deleteItem(assistant.id)"
            min-h-0
          >
            <q-item-section>删除</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-item>
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
        <q-icon name="sym_o_add" />
      </q-item-section>
      <q-item-section>
        新建助手
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar'
import { computed } from 'vue'
import { useAssistantsStore } from 'src/stores/assistants'
import { useRouter } from 'vue-router'
import AAvatar from './AAvatar.vue'
import SelectWorkspaceDialog from './SelectWorkspaceDialog.vue'

const props = defineProps<{
  workspaceId: string
}>()

const assistantsStore = useAssistantsStore()

const assistants = computed(() => assistantsStore.assistants.filter(a => a.workspaceId === props.workspaceId))

function getLink(id) {
  return props.workspaceId === '$root' ? `/assistants/${id}` : `/workspaces/${props.workspaceId}/assistants/${id}`
}
const router = useRouter()
async function addItem() {
  const id = await assistantsStore.add('新助手', props.workspaceId)
  router.push(getLink(id))
}

function move(id, workspaceId) {
  assistantsStore.update(id, { workspaceId })
}
const $q = useQuasar()
function moveToWorkspace(id) {
  $q.dialog({
    component: SelectWorkspaceDialog,
    componentProps: {
      accept: 'workspace'
    }
  }).onOk(workspaceId => {
    move(id, workspaceId)
  })
}
function deleteItem(id) {
  $q.dialog({
    title: '删除助手',
    message: '确定要删除助手吗？',
    cancel: true
  }).onOk(() => {
    assistantsStore.delete(id)
  })
}
</script>
