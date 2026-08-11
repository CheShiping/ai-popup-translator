import { useTranslationStore } from '../stores/translation'

export function TranslationPopup() {
  const { result, isLoading, error } = useTranslationStore()

  if (isLoading) {
    return (
      <div className="popup popup--loading">
        <div className="popup__spinner" />
        <span className="popup__loading-text">Translating...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="popup popup--error">
        <div className="popup__error-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        </div>
        <div className="popup__error">{error}</div>
      </div>
    )
  }

  if (!result) return null

  const isWord = !result.original.includes(' ')

  return (
    <div className="popup">
      <div className="popup__header">
        <span className="popup__original">{result.original}</span>
        {isWord && result.phonetic && (
          <span className="popup__phonetic">/{result.phonetic}/</span>
        )}
      </div>

      <div className="popup__translation">{result.translation}</div>

      {isWord && result.part_of_speech && (
        <div className="popup__pos">
          <span className="popup__pos-tag">{result.part_of_speech}</span>
        </div>
      )}

      {result.definition && (
        <div className="popup__definition">{result.definition}</div>
      )}

      {result.example && (
        <div className="popup__example">
          <span className="popup__example-label">Example:</span>
          {result.example}
        </div>
      )}

      <div className="popup__footer">
        <span className="popup__time">{result.timestamp}</span>
        <div className="popup__tags">
          {result.tags.map((tag) => (
            <span key={tag} className="popup__tag">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
