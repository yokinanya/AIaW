<template>
  <q-expansion-item
    v-if="item.type === 'folder'"
    :label="item.name"
    :content-inset-level="0.5"
    item-rd
    :header-class="{ 'bg-sec-c text-on-sec-c': item.id === selected }"
    @update:model-value="accept === 'folder' && (selected = item.id)"
    :default-opened="children.some(c => c.id === selected)"
  >
    <template #header>
      <q-item-section
        avatar
        min-w-0
      >
        <a-avatar
          size="32px"
          :avatar="item.avatar"
        />
      </q-item-section>
      <q-item-section>
        {{ item.name }}
      </q-item-section>
      <q-menu context-menu>
        <q-list style="min-width: 100px">
          <q-item
            clickable
            v-close-popup
            @click="renameItem(item)"
            min-h-0
          >
            <q-item-section>重命名</q-item-section>
          </q-item>
          <q-item
            clickable
            v-close-popup
            @click="changeAvatar(item)"
            min-h-0
          >
            <q-item-section>更换图标</q-item-section>
          </q-item>
          <q-item
            clickable
            v-close-popup
            @click="deleteItem(item)"
            min-h-0
          >
            <q-item-section>删除</q-item-section>
          </q-item>
          <q-item
            clickable
            v-close-popup
            @click="addWorkspace(item.id)"
            min-h-0
          >
            <q-item-section>新建工作区</q-item-section>
          </q-item>
          <q-item
            clickable
            v-close-popup
            @click="addFolder(item.id)"
            min-h-0
          >
            <q-item-section>新建文件夹</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </template>
    <template #default>
      <workspace-list-item
        v-for="child in children"
        :key="child.id"
        :item="child"
        :accept
        v-model:selected="selected"
        mx-0
      />
    </template>
  </q-expansion-item>

  <q-item
    v-else-if="accept === 'workspace'"
    clickable
    @click="selected = item.id"
    :class="{ 'bg-sec-c text-on-sec-c': item.id === selected }"
    item-rd
  >
    <q-item-section
      avatar
      min-w-0
    >
      <a-avatar
        size="32px"
        :avatar="item.avatar"
      />
    </q-item-section>
    <q-item-section>{{ item.name }}</q-item-section>
    <q-menu context-menu>
      <q-list style="min-width: 100px">
        <q-item
          clickable
          v-close-popup
          @click="renameItem(item)"
          min-h-0
        >
          <q-item-section>重命名</q-item-section>
        </q-item>
        <q-item
          clickable
          v-close-popup
          @click="changeAvatar(item)"
          min-h-0
        >
          <q-item-section>更换图标</q-item-section>
        </q-item>
        <q-item
          clickable
          v-close-popup
          @click="moveItem(item)"
          min-h-0
        >
          <q-item-section>移动至</q-item-section>
        </q-item>
        <q-item
          clickable
          v-close-popup
          @click="deleteItem(item)"
          min-h-0
        >
          <q-item-section>删除</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-item>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useWorkspacesStore } from 'src/stores/workspaces'
import { Folder, Workspace } from 'src/utils/types'
import AAvatar from './AAvatar.vue'
import { useWorkspaceActions } from 'src/composables/workspace-actions'

const props = defineProps<{
  item: Workspace | Folder
  accept: 'workspace' | 'folder'
}>()

const selected = defineModel<string>('selected')

const workspacesStore = useWorkspacesStore()

const { addWorkspace, addFolder, renameItem, moveItem, deleteItem, changeAvatar } = useWorkspaceActions()

const children = computed(() => {
  return workspacesStore.workspaces.filter(item => item.parentId === props.item.id)
})
</script>
