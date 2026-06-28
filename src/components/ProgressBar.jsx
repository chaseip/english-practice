export default function ProgressBar({ done, total }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)
  return (
    <div className="pb-2">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>{done} / {total} practiced</span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full">
        <div
          className="h-2 bg-green-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
