import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getModel, contexts } from '../lib/slots'
import SlotDrill from '../components/SlotDrill'
import SlotTable from '../components/SlotTable'
import { useSpeech } from '../hooks/useSpeech'
import { useProgress } from '../hooks/useProgress'

export default function PatternDrill() {
  const { id } = useParams()
  const navigate = useNavigate()
  const model = getModel(id)
  const { speak } = useSpeech()
  const { practiced, markPracticed } = useProgress()

  const [contextFilter, setContextFilter] = useState(null)
  const [exIndex, setExIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)

  if (!model) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Pattern not found.{' '}
        <button onClick={() => navigate('/')} className="ml-2 underline">Go home</button>
      </div>
    )
  }

  const examples = contextFilter
    ? model.examples.filter(e => e.context === contextFilter)
    : model.examples

  const safeIndex = Math.min(exIndex, examples.length - 1)
  const example = examples[safeIndex]

  function changeContext(ctx) {
    setContextFilter(ctx)
    setExIndex(0)
    setRevealed(false)
  }

  function go(delta) {
    setExIndex((safeIndex + delta + examples.length) % examples.length)
    setRevealed(false)
  }

  function handleSuccess() {
    markPracticed(model.id)
    setRevealed(true)
  }

  function handleReveal() {
    setRevealed(true)
    speak(example?.full ?? '')
  }

  const contextInfo = contexts.find(c => c.id === example?.context)
  const isPracticed = practiced.has(model.id)

  return (
    <div className="max-w-lg mx-auto min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 text-lg active:bg-gray-200 shrink-0"
          >
            ←
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-gray-300 shrink-0">{model.id}</span>
              <span className="text-sm font-semibold text-gray-800 truncate">{model.title_en}</span>
              {isPracticed && <span className="text-green-500 shrink-0 text-base">✓</span>}
            </div>
            <p className="text-xs text-gray-500 truncate">{model.title_ja}</p>
          </div>
        </div>
      </div>

      {/* Grammar note */}
      <div className="px-4 py-2 bg-white border-b">
        <p className="text-xs text-gray-500">{model.grammar}</p>
      </div>

      {/* Context filter */}
      <div className="flex gap-1.5 px-4 py-2 overflow-x-auto bg-white border-b no-scrollbar">
        <button
          onClick={() => changeContext(null)}
          className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 transition-colors ${
            contextFilter === null ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          All
        </button>
        {contexts.map(c => {
          if (!model.examples.some(e => e.context === c.id)) return null
          return (
            <button
              key={c.id}
              onClick={() => changeContext(contextFilter === c.id ? null : c.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 transition-colors ${
                contextFilter === c.id ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              {c.emoji} {c.label}
            </button>
          )
        })}
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Example nav */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => go(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 text-xl active:bg-gray-50"
          >
            ‹
          </button>
          <div className="text-center">
            <span className="text-sm text-gray-500">
              {safeIndex + 1} / {examples.length}
            </span>
            {contextInfo && (
              <div className="text-xs text-gray-400 mt-0.5">
                {contextInfo.emoji} {contextInfo.label}
              </div>
            )}
          </div>
          <button
            onClick={() => go(1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 text-xl active:bg-gray-50"
          >
            ›
          </button>
        </div>

        {/* Drill */}
        {example && (
          <SlotDrill
            key={`${model.id}-${safeIndex}`}
            example={example}
            onSuccess={handleSuccess}
            speak={speak}
          />
        )}

        {/* Reveal / answer section */}
        {revealed ? (
          <div className="space-y-3 pt-2 border-t border-gray-200">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-base font-semibold text-gray-900 mb-1">{example?.full}</p>
              <p className="text-sm text-gray-500 mb-3">{example?.ja}</p>
              <button
                onClick={() => speak(example?.full ?? '')}
                className="flex items-center gap-1.5 text-sm text-blue-600 font-medium active:text-blue-800"
              >
                🔊 Listen again
              </button>
            </div>
            {example && <SlotTable cells={example.cells} />}
            <button
              onClick={() => go(1)}
              className="w-full py-3 bg-gray-800 text-white rounded-xl font-medium active:bg-gray-700 transition-colors"
            >
              Next example →
            </button>
          </div>
        ) : (
          <button
            onClick={handleReveal}
            className="w-full py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-medium active:bg-gray-50 transition-colors"
          >
            🔊 Reveal &amp; Listen
          </button>
        )}
      </div>
    </div>
  )
}
