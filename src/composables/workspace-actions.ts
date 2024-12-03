import { toRaw } from 'vue'
import { useWorkspacesStore } from 'src/stores/workspaces'
import { useQuasar } from 'quasar'
import { dialogOptions } from 'src/utils/values'
import PickAvatarDialog from 'src/components/PickAvatarDialog.vue'
import SelectWorkspaceDialog from 'src/components/SelectWorkspaceDialog.vue'

export function useWorkspaceActions() {
  const workspacesStore = useWorkspacesStore()
  const $q = useQuasar()
  function addWorkspace(parentId = '$root') {
    $q.dialog({
      title: '新建工作区',
      prompt: {
        model: '',
        type: 'text',
        isValid: v => !!v.trim(),
        label: '名称'
      },
      cancel: true,
      ...dialogOptions
    }).onOk(name => {
      workspacesStore.addWorkspace(name.trim(), parentId)
    })
  }
  function addFolder(parentId = '$root') {
    $q.dialog({
      title: '新建文件夹',
      prompt: {
        model: '',
        type: 'text',
        isValid: v => !!v.trim(),
        label: '名称'
      },
      cancel: true,
      ...dialogOptions
    }).onOk(name => {
      workspacesStore.addFolder(name.trim(), parentId)
    })
  }
  function renameItem(item) {
    if (item) {
      $q.dialog({
        title: '重命名',
        prompt: {
          model: item.name,
          type: 'text',
          isValid: v => !!v.trim() && v !== item.name,
          label: '名称'
        },
        cancel: true,
        ...dialogOptions
      }).onOk(newName => {
        workspacesStore.updateItem(item.id, { name: newName.trim() })
      })
    }
  }
  function changeAvatar(item) {
    $q.dialog({
      component: PickAvatarDialog,
      componentProps: { model: item.avatar, defaultTab: 'icon' }
    }).onOk(avatar => {
      workspacesStore.updateItem(item.id, { avatar: toRaw(avatar) })
    })
  }
  function moveItem({ id }) {
    $q.dialog({
      component: SelectWorkspaceDialog,
      componentProps: {
        accept: 'folder'
      }
    }).onOk(parentId => {
      workspacesStore.updateItem(id, { parentId })
    })
  }
  function deleteItem({ id, type }) {
    $q.dialog({
      title: type === 'workspace' ? '删除工作区' : '删除文件夹',
      message: type === 'workspace' ? '确定要删除工作区吗？其内部的所有对话和助手都将被删除' : '确定要删除文件夹吗？其内部的所有工作区都将被删除',
      cancel: true,
      ok: {
        label: '删除',
        color: 'err',
        flat: true
      },
      ...dialogOptions
    }).onOk(() => { workspacesStore.deleteItem(id) })
  }
  return { addWorkspace, addFolder, renameItem, changeAvatar, moveItem, deleteItem }
}
