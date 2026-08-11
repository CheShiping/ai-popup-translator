import { useEffect } from 'react'
import { useUIStore } from './stores/ui'
import { useTheme } from './hooks/useTheme'
import { TranslationPopup } from './components/TranslationPopup'
import { SettingsPanel } from './components/SettingsPanel'
import { HistoryPanel } from './components/HistoryPanel'

export default function App() {
  const { viewMode, setViewMode } = useUIStore()
  useTheme()

  useEffect(() => {
    // Listen for navigation events from tray
    if (window.__TAURI_INTERNALS__) {
      import('@tauri-apps/api/event').then(({ listen }) => {
        const unlisten = listen<string>('navigate', (event) => {
          if (event.payload === 'settings' || event.payload === 'history') {
            setViewMode(event.payload)
          }
        })
        return () => { unlisten.then(fn => fn()) }
      })
    }
  }, [setViewMode])

  return (
    <div className="app" data-view={viewMode}>
      <nav className="nav">
        <div className="nav__brand">
          <div className="nav__logo">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 8l6 6M4 14l6-6 2-3M2 5h12M7 2h1M22 22l-5-10-5 10M14 18h6"/>
            </svg>
          </div>
          <span>AI ç¯è¯</span>
        </div>
        <div className="nav__links">
          <button
            className={`nav__link ${viewMode === 'popup' ? 'nav__link--active' : ''}`}
            onClick={() => setViewMode('popup')}
          >
            ç¯è¯
          </button>
          <button
            className={`nav__link ${viewMode === 'history' ? 'nav__link--active' : ''}`}
            onClick={() => setViewMode('history')}
          >
            åå²
          </button>
          <button
            className={`nav__link ${viewMode === 'settings' ? 'nav__link--active' : ''}`}
            onClick={() => setViewMode('settings')}
          >
            è®¾ç½®
          </button>
        </div>
      </nav>

      <main className="main">
        {viewMode === 'popup' && <TranslationPopup />}
        {viewMode === 'settings' && <SettingsPanel />}
        {viewMode === 'history' && <HistoryPanel />}
      </main>
    </div>
  )
}
