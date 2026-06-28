import { useState } from 'react'

const KEY = 'ep_practiced'

function load() {
  try {
    return new Set(JSON.parse(localStorage.getItem(KEY)) ?? [])
  } catch {
    return new Set()
  }
}

export function useProgress() {
  const [practiced, setPracticed] = useState(load)

  function markPracticed(id) {
    setPracticed(prev => {
      const next = new Set(prev)
      next.add(id)
      localStorage.setItem(KEY, JSON.stringify([...next]))
      return next
    })
  }

  function reset() {
    localStorage.removeItem(KEY)
    setPracticed(new Set())
  }

  return { practiced, markPracticed, reset }
}
