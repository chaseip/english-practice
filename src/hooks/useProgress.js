import { useState } from 'react'

const DEFAULT_KEY = 'ep_practiced'

function load(key) {
  try {
    return new Set(JSON.parse(localStorage.getItem(key)) ?? [])
  } catch {
    return new Set()
  }
}

// `key` lets separate sections track progress independently (e.g. word-order
// patterns vs. interjections) without their ids colliding in one Set.
export function useProgress(key = DEFAULT_KEY) {
  const [practiced, setPracticed] = useState(() => load(key))

  function markPracticed(id) {
    setPracticed(prev => {
      const next = new Set(prev)
      next.add(id)
      localStorage.setItem(key, JSON.stringify([...next]))
      return next
    })
  }

  function reset() {
    localStorage.removeItem(key)
    setPracticed(new Set())
  }

  return { practiced, markPracticed, reset }
}
