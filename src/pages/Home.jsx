import { Link } from 'react-router-dom'
import { models } from '../lib/slots'
import PatternCard from '../components/PatternCard'
import ContextFilter from '../components/ContextFilter'
import ProgressBar from '../components/ProgressBar'
import VoiceHelp from '../components/VoiceHelp'
import { useProgress } from '../hooks/useProgress'
import { useContextFilter } from '../hooks/useContextFilter'

export default function Home() {
  const [context, setContext] = useContextFilter()
  const { practiced, reset } = useProgress()

  const filtered = context
    ? models.filter(m => m.examples.some(e => e.context === context))
    : models

  return (
    <div className="max-w-lg mx-auto min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 px-4 pt-4 pb-3">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h1 className="text-xl font-bold text-gray-900">英語の語順20選</h1>
            <p className="text-xs text-gray-500">Travel English Word-Order Drills ✈️</p>
          </div>
          {practiced.size > 0 && (
            <button
              onClick={() => { if (confirm('Reset all progress?')) reset() }}
              className="text-xs text-gray-400 mt-1"
            >
              Reset
            </button>
          )}
        </div>
        <div className="mt-2">
          <ProgressBar done={practiced.size} total={models.length} />
        </div>
      </div>

      <ContextFilter active={context} onChange={setContext} />

      <VoiceHelp />

      {/* Link to the interjections quiz section */}
      <div className="px-4 pt-3">
        <Link
          to="/interjections"
          className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 p-4 active:bg-gray-50 transition-colors"
        >
          <span className="text-2xl">💬</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900">アメリカの相づち20選</p>
            <p className="text-xs text-gray-500">American interjections — choose the meaning</p>
          </div>
          <span className="text-gray-300 text-lg">›</span>
        </Link>
      </div>

      <div className="px-4 pt-3 pb-10 space-y-3">
        {filtered.map(model => (
          <PatternCard
            key={model.id}
            model={model}
            practiced={practiced.has(model.id)}
          />
        ))}
      </div>
    </div>
  )
}
