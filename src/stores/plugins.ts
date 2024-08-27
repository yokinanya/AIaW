import { LobeChatPluginManifest } from '@lobehub/chat-plugin-sdk'
import { defineStore } from 'pinia'
import { useLiveQuery } from 'src/composables/live-query'
import { persistentReactive } from 'src/composables/persistent-reactive'
import { db } from 'src/utils/db'
import { GradioPluginManifest, HuggingPluginManifest, InstalledPlugin, PluginsData } from 'src/utils/types'
import { buildLobePlugin, timePlugin, defaultData, whisperPlugin, videoTranscriptPlugin, buildGradioPlugin, calculatorPlugin, huggingToGradio, fluxPlugin, lobeDefaultData, gradioDefaultData, emotionsPlugin, docParsePlugin } from 'src/utils/plugins'
import { computed } from 'vue'

export const usePluginsStore = defineStore('plugins', () => {
  const installed = useLiveQuery(() => db.installedPlugins.toArray(), {
    initialValue: [] as InstalledPlugin[]
  })
  const installedIds = computed(() => installed.value.map(i => i.id))
  const [data, ready] = persistentReactive<PluginsData>('#plugins-data', defaultData)
  const plugins = computed(() => [
    calculatorPlugin,
    videoTranscriptPlugin,
    whisperPlugin,
    fluxPlugin,
    emotionsPlugin,
    docParsePlugin,
    timePlugin,
    ...installed.value.map(i => {
      if (i.type === 'lobechat') return buildLobePlugin(i.manifest, i.available)
      else return buildGradioPlugin(i.manifest, i.available)
    })
  ])

  async function installLobePlugin(manifest: LobeChatPluginManifest) {
    // @ts-expect-error - Dexie transaction doesn't support recursive type inference (LobeChatPluginManifest)
    await db.transaction('rw', db.installedPlugins, db.reactives, async () => {
      const id = `lobe-${manifest.identifier}`
      await db.installedPlugins.put({
        id,
        type: 'lobechat',
        available: true,
        manifest
      })
      await db.reactives.update('#plugins-data', {
        [`value.${id}`]: lobeDefaultData(manifest)
      })
    })
  }

  async function installGradioPlugin(manifest: GradioPluginManifest) {
    await db.transaction('rw', db.installedPlugins, db.reactives, async () => {
      await db.installedPlugins.put({
        id: manifest.id,
        type: 'gradio',
        available: true,
        manifest
      })
    })
    await db.reactives.update('#plugins-data', {
      [`value.${manifest.id}`]: gradioDefaultData(manifest)
    })
  }

  async function installHuggingPlugin(manifest: HuggingPluginManifest) {
    await installGradioPlugin(huggingToGradio(manifest))
  }

  async function uninstall(id: string) {
    await db.transaction('rw', db.installedPlugins, db.reactives, async () => {
      await db.installedPlugins.update(id, { available: false })
      await db.assistants.filter(a => !!a.plugins[id]).modify({ [`plugins.${id}`]: undefined })
    })
  }

  return {
    data,
    ready,
    plugins,
    installedIds,
    installLobePlugin,
    installHuggingPlugin,
    installGradioPlugin,
    uninstall
  }
})
