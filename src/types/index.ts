export interface TranslationResult {
  original: string
  translation: string
  phonetic?: string
  part_of_speech?: string
  definition?: string
  example?: string
  timestamp: string
  tags: string[]
}

export interface HistoryEntry {
  id: string
  original: string
  translation: string
  phonetic?: string
  part_of_speech?: string
  definition?: string
  example?: string
  timestamp: string
  tags: string[]
}

export interface AppConfig {
  api_key: string
  provider: string
  model: string
  custom_endpoint: string
  shortcut: string
  auto_save: boolean
  obsidian_path: string
  theme: 'dark' | 'light' | 'system'
  max_history: number
  custom_prompt: string
  default_tags: string[]
}

export const DEFAULT_CONFIG: AppConfig = {
  api_key: '',
  provider: 'qwen',
  model: 'qwen-turbo',
  custom_endpoint: '',
  shortcut: 'CmdOrCtrl+Shift+Q',
  auto_save: true,
  obsidian_path: '',
  theme: 'system',
  max_history: 1000,
  custom_prompt: '',
  default_tags: ['#è±è¯å¦ä¹'],
}

export const PROVIDERS = {
  openai: {
    name: 'OpenAI',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
  },
  qwen: {
    name: 'éè®¯åå¦',
    endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
    models: ['qwen-turbo', 'qwen-plus', 'qwen-max', 'qwen-long'],
  },
  deepseek: {
    name: 'DeepSeek',
    endpoint: 'https://api.deepseek.com/v1/chat/completions',
    models: ['deepseek-chat', 'deepseek-reasoner'],
  },
  anthropic: {
    name: 'Anthropic',
    endpoint: 'https://api.anthropic.com/v1/messages',
    models: ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022', 'claude-3-opus-20240229'],
  },
  moonshot: {
    name: 'Moonshot AI',
    endpoint: 'https://api.moonshot.cn/v1/chat/completions',
    models: ['moonshot-v1-8k', 'moonshot-v1-32k', 'moonshot-v1-128k'],
  },
  custom: {
    name: 'Custom',
    endpoint: '',
    models: [],
  },
} as const

export type ProviderKey = keyof typeof PROVIDERS
