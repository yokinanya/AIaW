import { createAnthropic } from '@ai-sdk/anthropic'
import { createOpenAI } from '@ai-sdk/openai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { Ref, ref, watchEffect } from 'vue'
import { useLocalPerfStore } from 'src/stores/local-perf'
import { Model } from 'src/utils/types'

const providerMap = {
  anthropic: { constructor: createAnthropic, settings: {} },
  openai: { constructor: createOpenAI, settings: { compatibility: 'strict' } },
  google: { constructor: createGoogleGenerativeAI, settings: {} }
}

export function useModel(provider, model: Ref<Model>) {
  const sdkModel = ref(null)
  const _model = ref<Model>(null)
  const { perfs } = useLocalPerfStore()
  watchEffect(() => {
    _model.value = model.value || perfs.model
    if (!_model.value || !provider.value) {
      sdkModel.value = null
      _model.value = null
      return
    }
    const providerType = provider.value.type || perfs.provider.type
    sdkModel.value = providerMap[providerType].constructor({
      baseURL: provider.value.baseURL || perfs.provider.baseURL || undefined,
      apiKey: provider.value.apiKey || perfs.provider.apiKey || undefined,
      ...providerMap[providerType].settings
    })(_model.value.name)
  })
  return { sdkModel, model: _model }
}
