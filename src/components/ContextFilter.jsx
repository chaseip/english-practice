import { contexts } from '../lib/slots'

export default function ContextFilter({ active, onChange }) {
  return (
    <div className="flex flex-wrap gap-2 px-4 py-2">
      <button
        onClick={() => onChange(null)}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
          active === null
            ? 'bg-gray-800 text-white'
            : 'bg-gray-100 text-gray-700 active:bg-gray-200'
        }`}
      >
        All
      </button>
      {contexts.map(c => (
        <button
          key={c.id}
          onClick={() => onChange(active === c.id ? null : c.id)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            active === c.id
              ? 'bg-gray-800 text-white'
              : 'bg-gray-100 text-gray-700 active:bg-gray-200'
          }`}
        >
          {c.emoji} {c.label}
        </button>
      ))}
    </div>
  )
}
