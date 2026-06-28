import { useState, useEffect } from 'react'
import { slotTypes, getColor, shuffle, checkAnswer } from '../lib/slots'

export default function SlotDrill({ example, onSuccess, speak }) {
  const [chips, setChips] = useState([])
  const [placed, setPlaced] = useState([])
  const [status, setStatus] = useState('drilling') // 'drilling' | 'correct' | 'wrong'

  function reset() {
    setChips(shuffle(example.cells.map((c, i) => ({ ...c, id: i }))))
    setPlaced([])
    setStatus('drilling')
  }

  useEffect(() => { reset() }, [example])

  function placeChip(chip) {
    if (status !== 'drilling') return
    const newPlaced = [...placed, chip]
    setChips(prev => prev.filter(c => c.id !== chip.id))
    setPlaced(newPlaced)

    if (newPlaced.length === example.cells.length) {
      if (checkAnswer(newPlaced, example.cells)) {
        setStatus('correct')
        speak(example.full)
        onSuccess?.()
      } else {
        setStatus('wrong')
        setTimeout(reset, 1200)
      }
    }
  }

  function returnChip(index) {
    if (status !== 'drilling') return
    const chip = placed[index]
    setPlaced(prev => prev.filter((_, i) => i !== index))
    setChips(prev => [...prev, chip])
  }

  const cellCount = example.cells.length

  return (
    <div className="space-y-5">
      {/* Japanese prompt */}
      <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 text-center">
        <p className="text-base font-medium text-gray-800 leading-relaxed">{example.ja}</p>
      </div>

      {/* Slot headers */}
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${cellCount}, minmax(0, 1fr))` }}
      >
        {example.cells.map((c, i) => (
          <div
            key={i}
            className="px-1 py-1.5 text-white text-center text-xs font-medium rounded-t leading-tight"
            style={{ backgroundColor: slotTypes[c.type]?.color ?? '#9E9E9E' }}
          >
            {slotTypes[c.type]?.ja ?? c.type}
          </div>
        ))}
      </div>

      {/* Drop zones */}
      <div
        className="grid gap-1 -mt-4"
        style={{ gridTemplateColumns: `repeat(${cellCount}, minmax(0, 1fr))` }}
      >
        {example.cells.map((_, i) => {
          const placedChip = placed[i]
          return (
            <button
              key={i}
              onClick={() => placedChip && returnChip(i)}
              className={`min-h-[48px] px-1 py-2 text-sm font-medium rounded-b border-2 transition-all text-center leading-tight ${
                status === 'correct'
                  ? 'border-green-400 bg-green-50 text-green-800'
                  : status === 'wrong' && placedChip
                  ? 'border-red-400 bg-red-50 text-red-800 animate-pulse'
                  : placedChip
                  ? 'border-gray-300 bg-white text-gray-800 active:bg-gray-50'
                  : 'border-dashed border-gray-300 bg-gray-50'
              }`}
            >
              {placedChip ? placedChip.text : ''}
            </button>
          )
        })}
      </div>

      {/* Status message */}
      {status === 'correct' && (
        <div className="text-center text-green-700 font-semibold text-sm">
          Correct! 🎉
        </div>
      )}
      {status === 'wrong' && (
        <div className="text-center text-red-600 font-semibold text-sm">
          Not quite — try again!
        </div>
      )}

      {/* Available chips */}
      <div className="flex flex-wrap gap-2 min-h-[52px] p-3 bg-gray-100 rounded-xl">
        {chips.map(chip => (
          <button
            key={chip.id}
            onClick={() => placeChip(chip)}
            className="px-3 py-2 text-white text-sm font-medium rounded-lg active:scale-95 transition-transform shadow-sm"
            style={{ backgroundColor: getColor(chip.type) }}
          >
            {chip.text}
          </button>
        ))}
        {chips.length === 0 && status === 'drilling' && (
          <span className="text-xs text-gray-400 self-center w-full text-center">
            Tap a slot above to return a word
          </span>
        )}
      </div>

      {/* Reset button */}
      <button
        onClick={reset}
        className="w-full py-2.5 text-sm text-gray-600 bg-gray-100 rounded-xl active:bg-gray-200 transition-colors"
      >
        Reset
      </button>
    </div>
  )
}
