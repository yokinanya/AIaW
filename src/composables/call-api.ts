import { usePluginsStore } from 'src/stores/plugins'
import { Schema, Validator } from '@cfworker/json-schema'
import { Plugin, PluginApi, StoredItem } from 'src/utils/types'
import { db } from 'src/utils/db'
import { genId } from 'src/utils/functions'

export function useCallApi({ workspace, dialog }) {
  const pluginsStore = usePluginsStore()
  function getPluginSettings(plugin: Plugin) {
    const settings = pluginsStore.data[plugin.id].settings
    if (plugin.settings.properties._workspaceId) {
      settings._workspaceId = workspace.value.id
    }
    if (plugin.settings.properties._dialogId) {
      settings._dialogId = dialog.value.id
    }
    const { valid } = new Validator(plugin.settings as Schema).validate(settings)
    return { valid, settings }
  }

  async function callApi(plugin: Plugin, api: PluginApi, args): Promise<{ result?: StoredItem[], error?: string }> {
    const { valid: argValid } = new Validator(api.parameters as Schema).validate(args)
    if (!argValid) {
      return { result: null, error: 'Arguments validation failed' }
    }
    const { valid: SettingsValid, settings } = getPluginSettings(plugin)
    if (!SettingsValid) {
      return { result: null, error: 'Plugin settings validation failed' }
    }
    try {
      const res = await api.execute(args, settings)
      const result = res.map(i => ({ ...i, id: genId(), dialogId: dialog.value.id, references: 1 }))
      await db.items.bulkPut(result)
      return { result, error: null }
    } catch (e) {
      return { result: null, error: e.message }
    }
  }
  return { getPluginSettings, callApi }
}
