import { useState } from 'react'
import { useConfigStore } from '../stores/config'
import { PROVIDERS, type ProviderKey } from '../types'

export function SettingsPanel() {
  const { config, setConfig, setProvider, resetConfig } = useConfigStore()
  const [apiKeyVisible, setApiKeyVisible] = useState(false)
  const [testStatus, setTestStatus] = useState<string | null>(null)
  const [testing, setTesting] = useState(false)

  const currentProvider = PROVIDERS[config.provider as ProviderKey] || PROVIDERS.qwen

  const handleTestConnection = async () => {
    setTesting(true)
    setTestStatus('æµè¯è¿æ¥ä¸­...')
    try {
      if (window.__TAURI_INTERNALS__) {
        const { invoke } = await import('@tauri-apps/api/core')
        const result = await invoke<string>('test_api_connection')
        setTestStatus(result)
      } else {
        setTestStatus('Web mode - cannot test')
      }
    } catch (e) {
      setTestStatus(`Connection failed: ${e}`)
    }
    setTesting(false)
  }

  return (
    <div className="settings">
      <div className="settings__header">
        <h2 className="settings__title">è®¾ç½®</h2>
        <button className="btn btn--ghost" onClick={resetConfig}>éç½®</button>
      </div>

      <div className="settings__section">
        <h3 className="settings__section-title">API é®ç½®</h3>

        <div className="field">
          <label className="field__label">AI æå¡åº</label>
          <select
            className="field__select"
            value={config.provider}
            onChange={(e) => setProvider(e.target.value as ProviderKey)}
          >
            {Object.entries(PROVIDERS).map(([key, provider]) => (
              <option key={key} value={key}>{provider.name}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="field__label">API Key</label>
          <div className="field__row">
            <input
              className="field__input"
              type={apiKeyVisible ? 'text' : 'password'}
              value={config.api_key}
              onChange={(e) => setConfig({ api_key: e.target.value })}
            />
            <button
              className="btn btn--ghost btn--sm"
              onClick={() => setApiKeyVisible(!apiKeyVisible)}
            >
              {apiKeyVisible ? 'é²è­' : 'æ¾ç¤º'}
            </button>
          </div>
        </div>

        <div className="field">
          <label className="field__label">æ¨ååé¡¹</label>
          <select
            className="field__select"
            value={config.model}
            onChange={(e) => setConfig({ model: e.target.value })}
          >
            {currentProvider.models.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        {config.provider === 'custom' && (
          <div className="field">
            <label className="field__label">èªå®ä¹ç«¯ç¹</label>
            <input
              className="field__input"
              value={config.custom_endpoint}
              onChange={(e) => setConfig({ custom_endpoint: e.target.value })}
              placeholder="https://your-api-endpoint.com/v1/chat/completions"
            />
          </div>
        )}

        <button
          className="btn btn--primary"
          onClick={handleTestConnection}
          disabled={testing || !config.api_key}
        >
          {testing ? 'æµè¯ä¸­...' : 'æµè¯è¿æ¥'}
        </button>
        {testStatus && (
          <div className={`field__status ${testStatus.includes('failed') || testStatus.includes('Failed') ? 'field__status--error' : 'field__status--success'}`}>
            {testStatus}
          </div>
        )}
      </div>

      <div className="settings__section">
        <h3 className="settings__section-title">Obsidian é®ç½®</h3>

        <div className="field">
          <label className="field__label">ç¥èºåºè·å¾</label>
          <input
            className="field__input"
            value={config.obsidian_path}
            onChange={(e) => setConfig({ obsidian_path: e.target.value })}
            placeholder="~/Documents/Obsidian/AI Translation"
          />
        </div>

        <div className="field">
          <label className="field__label">
            <input
              type="checkbox"
              checked={config.auto_save}
              onChange={(e) => setConfig({ auto_save: e.target.checked })}
            />
            <span>èªå¨ä¿å­å° Obsidian</span>
          </label>
        </div>

        <div className="field">
          <label className="field__label">é»è®¤æ ä¾ç¾</label>
          <input
            className="field__input"
            value={config.default_tags.join(', ')}
            onChange={(e) => setConfig({ default_tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
            placeholder="#english, #daily"
          />
        </div>
      </div>

      <div className="settings__section">
        <h3 className="settings__section-title">å¤è®ç®ç®</h3>

        <div className="field">
          <label className="field__label">ä¸»é¢é¢å½©</label>
          <select
            className="field__select"
            value={config.theme}
            onChange={(e) => setConfig({ theme: e.target.value as 'dark' | 'light' | 'system' })}
          >
            <option value="system">é¡µé½ç³»ç»</option>
            <option value="dark">æäº®</option>
            <option value="light">æ¼äº®</option>
          </select>
        </div>

        <div className="field">
          <label className="field__label">èªå®ä¹æç¤ºè¯</label>
          <textarea
            className="field__textarea"
            value={config.custom_prompt}
            onChange={(e) => setConfig({ custom_prompt: e.target.value })}
            placeholder="èªå®ä¹ç¯è¯æç¤ºè¯ï¼ç¨äºä¸ä¸ä¸ªå¯çåº¦..."
            rows={3}
          />
        </div>
      </div>
    </div>
  )
}
