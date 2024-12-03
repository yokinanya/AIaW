import { createAnthropic } from '@ai-sdk/anthropic'
import { createOpenAI } from '@ai-sdk/openai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { Ref, ref, watchEffect } from 'vue'
import { useLocalPerfStore } from 'src/stores/local-perf'
import { Model } from 'src/utils/types'
import { useObservable } from '@vueuse/rxjs'
import { db } from 'src/utils/db'
import { LitellmBaseURL } from 'src/utils/config'

const providerMap = {
  anthropic: { constructor: createAnthropic, settings: {} },
  openai: { constructor: createOpenAI, settings: { compatibility: 'strict' } },
  google: { constructor: createGoogleGenerativeAI, settings: {} }
}

export function useModel(provider, model: Ref<Model>) {
  const sdkModel = ref(null)
  const _model = ref<Model>(null)
  const { perfs } = useLocalPerfStore()
  const user = useObservable(db.cloud.currentUser)
  watchEffect(() => {
    _model.value = model.value || perfs.model
    if (!_model.value || !provider.value) {
      sdkModel.value = null
      _model.value = null
      return
    }
    let _provider = null
    if (provider.value.apiKey) _provider = provider.value
    else if (perfs.provider.apiKey) _provider = perfs.provider
    else if (user.value.isLoggedIn) _provider = { type: 'openai', apiKey: user.value.data.apiKey, baseURL: LitellmBaseURL }
    else {
      sdkModel.value = null
      _model.value = null
      return
    }
    sdkModel.value = providerMap[_provider.type].constructor({
      baseURL: _provider.baseURL || undefined,
      apiKey: _provider.apiKey || undefined,
      ...providerMap[_provider.type].settings
    })(_model.value.name)
  })
  return { sdkModel, model: _model }
}
