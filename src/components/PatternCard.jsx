import { useNavigate } from 'react-router-dom'
import { slotTypes } from '../lib/slots'

export default function PatternCard({ model, practiced }) {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(`/pattern/${model.id}`)}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all active:scale-95 ${
        practiced
          ? 'border-green-400 bg-green-50'
          : 'border-gray-200 bg-white'
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl font-bold text-gray-200 w-8 shrink-0 mt-0.5">
          {model.id}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-1 mb-1.5">
            {model.slots.map((s, i) => (
              <span
                key={i}
                className="text-xs font-medium px-2 py-0.5 rounded text-white leading-tight"
                style={{ backgroundColor: slotTypes[s]?.color ?? '#9E9E9E' }}
              >
                {slotTypes[s]?.ja ?? s}
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-500 leading-snug">{model.grammar}</p>
        </div>
        {practiced && (
          <span className="text-green-500 text-lg shrink-0 mt-0.5">✓</span>
        )}
      </div>
    </button>
  )
}
