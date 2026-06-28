import { slotTypes } from '../lib/slots'

export default function SlotTable({ cells }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full border-collapse text-sm min-w-max">
        <thead>
          <tr>
            {cells.map((c, i) => (
              <th
                key={i}
                className="px-3 py-2 text-white text-center font-medium text-xs border-r border-white last:border-r-0"
                style={{ backgroundColor: slotTypes[c.type]?.color ?? '#9E9E9E' }}
              >
                {slotTypes[c.type]?.ja ?? c.type}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {cells.map((c, i) => (
              <td
                key={i}
                className="px-3 py-3 text-center border-r border-gray-200 last:border-r-0 bg-white font-medium text-gray-800"
              >
                {c.text}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}
