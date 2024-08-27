<script setup>
import { CodeJar } from 'codejar'
import hljs from 'highlight.js/lib/core'
import 'highlight.js/styles/atom-one-dark.css'
import { withLineNumbers } from 'codejar-linenumbers'
import 'codejar-linenumbers/js/codejar-linenumbers.css'

import javascript from 'highlight.js/lib/languages/javascript'
import markdown from 'highlight.js/lib/languages/markdown'
import json from 'highlight.js/lib/languages/json'
import python from 'highlight.js/lib/languages/python'
import typescript from 'highlight.js/lib/languages/typescript'

// Then register the languages you need
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('markdown', markdown)
hljs.registerLanguage('json', json)
hljs.registerLanguage('python', python)
hljs.registerLanguage('typescript', typescript)

import { onMounted } from 'vue'

onMounted(() => {
  const node = document.querySelector('.editor')

  // Wrap highlighting function to show line numbers.
  const jar = CodeJar(
    node,
    withLineNumbers(editor => {
      editor.innerHTML = hljs.highlight(
        editor.textContent,
        { language: 'javascript' }
      ).value
    })
  )
  jar.updateCode('let foo = "bar"')
})
</script>
<template>
  <div class="editor hljs" />
</template>
