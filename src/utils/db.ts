import Dexie from 'dexie'
import { defaultAvatar, genId } from './functions'
import { Workspace, Folder, Dialog, Message, Assistant, Canvas, StoredReactive, StoredItem, InstalledPlugin } from './types'
import { AssistantDefaultPrompt, exampleWsIndexContent } from './templates'
import dexieCloud, { DexieCloudTable } from 'dexie-cloud-addon'

type Db = Dexie & {
  workspaces: DexieCloudTable<Workspace | Folder, 'id'>
  dialogs: DexieCloudTable<Dialog, 'id'>
  messages: DexieCloudTable<Message, 'id'>
  assistants: DexieCloudTable<Assistant, 'id'>
  canvases: DexieCloudTable<Canvas, 'id'>
  installedPlugins: DexieCloudTable<InstalledPlugin, 'id'>
  reactives: DexieCloudTable<StoredReactive, 'key'>
  avatarImages: DexieCloudTable<StoredItem, 'id'>
}

const db = new Dexie('data', { addons: [dexieCloud] }) as Db

db.cloud.configure({
  databaseUrl: 'https://aiaw-sync.krytro.com',
  requireAuth: false,
  customLoginGui: true
})

db.version(1).stores({
  workspaces: 'id, name, parentId',
  dialogs: 'id, name, workspaceId',
  messages: 'id, dialogId, workspaceId, sender',
  assistants: 'id, name, workspaceId',
  canvases: 'id, name, workspaceId',
  installedPlugins: 'id',
  reactives: 'key',
  avatarImages: 'id'
})

const defaultModelSettings = {
  temperature: 0.5,
  topP: 1,
  presencePenalty: 0,
  frequencyPenalty: 0,
  maxSteps: 4,
  maxRetries: 1
}

db.on.populate.subscribe(() => {
  db.on.ready.subscribe((db: Db) => {
    const initialWorkspaceId = genId()
    const initialAssistantId = genId()
    db.workspaces.add({
      id: initialWorkspaceId,
      name: '示例工作区',
      avatar: { type: 'icon', icon: 'sym_o_menu_book' },
      type: 'workspace',
      parentId: '$root',
      prompt: '',
      defaultAssistantId: initialAssistantId,
      indexContent: exampleWsIndexContent,
      vars: {}
    } as Workspace)
    db.assistants.add({
      id: initialAssistantId,
      name: '默认助手',
      avatar: defaultAvatar('AI'),
      workspaceId: initialWorkspaceId,
      prompt: '',
      promptTemplate: AssistantDefaultPrompt,
      promptVars: [],
      provider: {},
      model: null,
      modelSettings: { ...defaultModelSettings },
      plugins: {}
    })
    db.reactives.add({
      key: '#local-data',
      value: {
        lastWorkspaceId: initialWorkspaceId
      }
    })
  }, false)
})

export { db, defaultModelSettings }
export type { Db }
