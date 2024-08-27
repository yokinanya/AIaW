import { defineStore } from 'pinia'
import { useLiveQuery } from 'src/composables/live-query'
import { db, defaultModelSettings } from 'src/utils/db'
import { defaultAvatar, genId } from 'src/utils/functions'
import { Assistant } from 'src/utils/types'
import { AssistantDefaultPrompt } from 'src/utils/templates'

export const useAssistantsStore = defineStore('assistants', () => {
  const assistants = useLiveQuery(() => db.assistants.toArray(), { initialValue: [] as Assistant[] })

  async function add(name: string, workspaceId = '$root') {
    return await db.assistants.add({
      id: genId(),
      name,
      avatar: defaultAvatar('AI'),
      workspaceId,
      prompt: '',
      promptTemplate: AssistantDefaultPrompt,
      promptVars: [],
      provider: {},
      model: null,
      modelSettings: { ...defaultModelSettings },
      plugins: {}
    })
  }

  async function update(id: string, changes) {
    return await db.assistants.update(id, changes)
  }

  async function put(assistant: Assistant) {
    return await db.assistants.put(assistant)
  }

  async function delete_(id: string) {
    return await db.assistants.delete(id)
  }

  return {
    assistants,
    add,
    update,
    put,
    delete: delete_
  }
})
