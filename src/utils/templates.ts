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

### 使用指引

点击右侧边栏的「**新建对话**」即可开始对话

- 你可以在左侧边栏设置中更改发送消息的快捷键，默认为 Ctrl+Enter
- 本应用是跨平台的，可以在电脑、手机等不同设备上使用
- 点击右侧边栏中的助手，进入助手设置，可以设定提示词，以及启用各种插件
- 在左侧边栏，你可以创建多个工作区，将不同主题的对话分隔开
- 点击右上角设置图标进入工作区设置，可以切换默认助手、更改此处显示的内容

更多内容详见<a href="https://docs.aiaw.app/usage/" target="_blank">使用指南</a>

GitHub: <a href="https://github.com/NitroRCr/aiaw" target="_blank">NitroRCr/AIaW</a>
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
