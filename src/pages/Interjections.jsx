import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { interjections, buildOptions } from '../lib/interjections'
import { shuffle } from '../lib/slots'
import { useSpeech } from '../hooks/useSpeech'
import { useProgress } from '../hooks/useProgress'
import ProgressBar from '../components/ProgressBar'

export default function Interjections() {
  const navigate = useNavigate()
  const { speak } = useSpeech()
  const { practiced, markPracticed, reset } = useProgress('ep_interjections')

  // Shuffle the deck once per mount so the order feels fresh each visit.
  const [deck, setDeck] = useState(() => shuffle(interjections))
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState(null)
  const [correctCount, setCorrectCount] = useState(0)

  const item = deck[index]
  const done = index >= deck.length

  // Rebuild options only when we move to a new card.
  const options = useMemo(
    () => (item ? buildOptions(item) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [item?.id]
  )

  function choose(option) {
    if (picked) return // lock after first tap
    setPicked(option)
    speak(item.phrase)
    if (option === item.meaning) {
      setCorrectCount(c => c + 1)
      markPracticed(item.id)
    }
  }

  function next() {
    setPicked(null)
    setIndex(i => i + 1)
  }

  function restart() {
    setDeck(shuffle(interjections))
    setIndex(0)
    setPicked(null)
    setCorrectCount(0)
  }

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
            <h1 className="text-base font-bold text-gray-900 truncate">アメリカの相づち20選</h1>
            <p className="text-xs text-gray-500 truncate">American Interjections — Choose the Meaning</p>
          </div>
          {practiced.size > 0 && (
            <button
              onClick={() => { if (confirm('Reset interjection progress?')) reset() }}
              className="text-xs text-gray-400 shrink-0"
            >
              Reset
            </button>
          )}
        </div>
        <div className="mt-2">
          <ProgressBar done={practiced.size} total={interjections.length} />
        </div>
      </div>

      {done ? (
        <div className="px-4 py-10 text-center space-y-4">
          <div className="text-5xl">🎉</div>
          <p className="text-lg font-bold text-gray-900">
            {correctCount} / {deck.length} correct
          </p>
          <p className="text-sm text-gray-500">よくできました！</p>
          <button
            onClick={restart}
            className="w-full py-3 bg-gray-800 text-white rounded-xl font-medium active:bg-gray-700 transition-colors"
          >
            Play again ↺
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-medium active:bg-gray-50 transition-colors"
          >
            Home
          </button>
        </div>
      ) : (
        <div className="px-4 py-4 space-y-4">
          {/* Counter */}
          <div className="text-center text-sm text-gray-500">
            {index + 1} / {deck.length}
          </div>

          {/* Phrase card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <p className="text-2xl font-bold text-gray-900 mb-3">{item.phrase}</p>
            <button
              onClick={() => speak(item.phrase)}
              className="inline-flex items-center gap-1.5 text-sm text-blue-600 font-medium active:text-blue-800"
            >
              🔊 Listen
            </button>
          </div>

          {/* Options */}
          <div className="space-y-2">
            {options.map(option => {
              const isCorrect = option === item.meaning
              const isPicked = option === picked
              let cls = 'bg-white border-gray-200 text-gray-800 active:bg-gray-50'
              if (picked) {
                if (isCorrect) cls = 'bg-green-50 border-green-400 text-green-800'
                else if (isPicked) cls = 'bg-red-50 border-red-400 text-red-800'
                else cls = 'bg-white border-gray-200 text-gray-400'
              }
              return (
                <button
                  key={option}
                  onClick={() => choose(option)}
                  disabled={!!picked}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-colors ${cls}`}
                >
                  {picked && isCorrect && '✓ '}
                  {picked && isPicked && !isCorrect && '✗ '}
                  {option}
                </button>
              )
            })}
          </div>

          {/* Reveal after answering */}
          {picked && (
            <div className="space-y-3 pt-2 border-t border-gray-200">
              <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-1">
                <p className="text-base font-semibold text-gray-900">{item.example}</p>
                <p className="text-sm text-gray-500">{item.example_ja}</p>
                {item.note && (
                  <p className="text-xs text-gray-400 pt-1">💡 {item.note}</p>
                )}
              </div>
              <button
                onClick={next}
                className="w-full py-3 bg-gray-800 text-white rounded-xl font-medium active:bg-gray-700 transition-colors"
              >
                {index + 1 === deck.length ? 'See results →' : 'Next →'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
