import { useState, useEffect } from 'react'
import { useHistoryStore } from '../stores/history'
import type { HistoryEntry } from '../types'

export function HistoryPanel() {
  const { entries, searchQuery, setSearchQuery, clearHistory, filteredEntries } = useHistoryStore()
  const [localEntries, setLocalEntries] = useState<HistoryEntry[]>([])

  useEffect(() => {
    // Load history from Tauri backend
    if (window.__TAURI_INTERNALS__) {
      import('@tauri-apps/api/core').then(({ invoke }) => {
        invoke<HistoryEntry[]>('get_history').then(setLocalEntries).catch(() => {})
      })
    }
  }, [entries])

  const displayEntries = localEntries.length > 0 ? localEntries : filteredEntries()

  return (
    <div className="history">
      <div className="history__header">
        <h2 className="history__title">åå²è®°å½</h2>
        {entries.length > 0 && (
          <button className="btn btn--ghost btn--sm" onClick={clearHistory}>
            æ¸é¨å
          </button>
        )}
      </div>

      <div className="history__search">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          className="history__search-input"
          placeholder="æç´¢ç¯è¯è®°å½..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {displayEntries.length === 0 ? (
        <div className="history__empty">
          <div className="history__empty-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
          <p>è¿æ²¡æç¯è¯è®°å½</p>
          <p className="history__empty-hint">éææåè®åºçåè¯è¯å¼å¨</p>
        </div>
      ) : (
        <div className="history__list">
          {displayEntries.map((entry) => (
            <HistoryItem key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  )
}

function HistoryItem({ entry }: { entry: HistoryEntry }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="history-item" onClick={() => setExpanded(!expanded)}>
      <div className="history-item__main">
        <span className="history-item__original">{entry.original}</span>
        <span className="history-item__translation">{entry.translation}</span>
      </div>
      <div className="history-item__meta">
        <span className="history-item__time">{entry.timestamp}</span>
        <div className="history-item__tags">
          {entry.tags.map((tag) => (
            <span key={tag} className="popup__tag">{tag}</span>
          ))}
        </div>
      </div>
      {expanded && (
        <div className="history-item__detail">
          {entry.phonetic && <div className="history-item__phonetic">/{entry.phonetic}/</div>}
          {entry.part_of_speech && <div className="history-item__pos">{entry.part_of_speech}</div>}
          {entry.definition && <div className="history-item__def">{entry.definition}</div>}
          {entry.example && <div className="history-item__example">{entry.example}</div>}
        </div>
      )}
    </div>
  )
}
