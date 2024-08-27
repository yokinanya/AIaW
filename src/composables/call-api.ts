import { usePluginsStore } from 'src/stores/plugins'
import { Schema, Validator } from '@cfworker/json-schema'
import { Plugin, PluginApi } from 'src/utils/types'

export function useCallApi({ workspace, dialog }) {
  const pluginsStore = usePluginsStore()
  function getPluginSettings(plugin: Plugin) {
    const settings = pluginsStore.data[plugin.id].settings
    if (plugin.settings.properties.workspaceId) {
      settings.workspaceId = workspace.value.id
    }
    if (plugin.settings.properties.$dialogId) {
      settings.$dialogId = dialog.value.id
    }
    const { valid } = new Validator(plugin.settings as Schema).validate(settings)
    return { valid, settings }
  }

  async function callApi(plugin: Plugin, api: PluginApi, args) {
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
      return { result: res, error: null }
    } catch (e) {
      return { result: null, error: e.message }
    }
  }
  return { getPluginSettings, callApi }
}
