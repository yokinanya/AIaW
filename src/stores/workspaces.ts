import { defineStore } from 'pinia'
import { useLiveQuery } from 'src/composables/live-query'
import { db } from 'src/utils/db'
import { genId } from 'src/utils/functions'
import { Workspace } from 'src/utils/types'
import { defaultWsIndexContent } from 'src/utils/templates'

export const useWorkspacesStore = defineStore('workspaces', () => {
  const workspaces = useLiveQuery(() => db.workspaces.toArray(), { initialValue: [] as Workspace[] })

  async function addWorkspace(name: string, parentId = '$root') {
    return await db.workspaces.add({
      id: genId(),
      name,
      avatar: { type: 'icon', icon: 'sym_o_deployed_code' },
      type: 'workspace',
      parentId,
      prompt: '',
      indexContent: defaultWsIndexContent,
      vars: {}
    } as Workspace)
  }

  async function addFolder(name: string, parentId = '$root') {
    return await db.workspaces.add({
      id: genId(),
      name,
      avatar: { type: 'icon', icon: 'sym_o_folder' },
      type: 'folder',
      parentId
    })
  }

  async function updateItem(id: string, changes) {
    return await db.workspaces.update(id, changes)
  }

  async function putItem(workspace: Workspace) {
    return await db.workspaces.put(workspace)
  }

  async function deleteItem(id) {
    const keys = await db.workspaces.where('parentId').equals(id).primaryKeys()
    for (const key of keys) {
      await deleteItem(key)
    }
    await db.transaction('rw', [db.workspaces, db.dialogs, db.messages, db.items, db.assistants, db.canvases], async () => {
      await db.dialogs.where('workspaceId').equals(id).eachKey(dialogId => {
        db.messages.where('dialogId').equals(dialogId).delete()
        db.items.where('dialogId').equals(dialogId).delete()
      })
      await db.dialogs.where('workspaceId').equals(id).delete()
      await db.assistants.where('workspaceId').equals(id).delete()
      await db.canvases.where('workspaceId').equals(id).delete()
      await db.workspaces.delete(id)
    })
    return true
  }

  return {
    workspaces,
    addWorkspace,
    addFolder,
    updateItem,
    putItem,
    deleteItem
  }
})
