const GenDialogTitle =
`Create a concise, 3-5 word title with an emoji as a title for the chat history, in the given language. Suitable Emojis for the summary can be used to enhance understanding but avoid quotation marks or special formatting. RESPOND ONLY WITH THE TITLE TEXT.

Examples of titles:
📉 Stock Market Trends
🍪 Perfect Chocolate Chip Recipe
Evolution of Music Streaming
Remote Work Productivity Tips
Artificial Intelligence in Healthcare
🎮 Video Game Development Insights

<chat_history>
{%- for content in contents %}
{%- if content.type == 'user-message' %}
<user_message>
{{ content.text }}
</user_message>
{%- elsif content.type == 'assistant-message' %}
<assistant_message>
{{ content.text }}
</assistant_message>
{%- endif %}
{%- endfor %}
</chat_history>
`

const PluginsPrompt =
`<plugins>
{%- for plugin in plugins %}
<plugin id="{{ plugin.id }}">
{%- if plugin.prompt %}
<plugin_prompt>
{{ plugin.prompt }}
</plugin_prompt>
{%- endif %}
{%- for action in plugin.actions %}
<plugin_action name="{{ action.name }}">
{{ action.prompt }}
</plugin_action>
{%- endfor %}
</plugin>
{%- endfor %}
</plugins>
`

const ActionMessage =
`<!-- 助手调用 Action 的记录 -->
## action
{%- if action._content %}
<{{ action.pluginId }}-{{ action.name }} {{ action.args | json }}>
{{ action._content }}
</{{ action.pluginId }}-{{ action.name }}>
{%- else %}
<{{ action.pluginId }}-{{ action.name }} {{ action.args | json }} />
{%- endif %}
## status
{{ action.status }}
{%- if action.result %}
## result
{{ action.result }}
{%- endif %}
{%- if action.error %}
## error
{{ action.error }}
{%- endif %}
`

const AssistantDefaultPrompt =
`{%- if _rolePrompt %}
<role_prompt>
{{ _rolePrompt }}
</role_prompt>
{%- endif %}

{{ _pluginsPrompt }}
`

const defaultWsIndexContent =
`## {{ workspace.name }}

这里是工作区主页。

点击右侧边栏的「新建对话」即可开始对话。

### 使用指南

#### 工作区

你可以在左侧创建/切换工作区。将不同主题的工作放到不同的工作区，以避免混淆和提高效率。在工作区设置中，你还可以设置**工作区提示词**，它可以被所有助手共享。你可以将整个工作区共有的概况、要求等放在这里。

#### 助手

在右侧，点击“新建助手”可以创建一个助手。这个助手隶属于这个工作区。此外，还可以创建**全局助手**，可以在所有工作区使用。

对于每个助手，都可以设置不同的 Prompt、服务商、模型、插件、模型参数等。

#### 提示词

你可以在提示词使用模板规则，这意味着提示词可以是动态的。提示词遵循 [LiquidJS](https://liquidjs.com/) 语法，你可以插入变量，使用条件、循环等。

除了内置的一些变量，你还可以添加自定义变量。这些变量的值将在对话时输入。
`

const exampleWsIndexContent = defaultWsIndexContent

export {
  GenDialogTitle,
  PluginsPrompt,
  ActionMessage,
  AssistantDefaultPrompt,
  defaultWsIndexContent,
  exampleWsIndexContent
}
