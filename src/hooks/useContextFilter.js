import { useState } from 'react'

const KEY = 'ep_context'

// Shared travel-context filter, persisted so it stays selected when moving
// between the home list and a pattern drill (and across reloads).
export function useContextFilter() {
  const [context, setContextState] = useState(() => localStorage.getItem(KEY) || null)

  function setContext(ctx) {
    if (ctx) localStorage.setItem(KEY, ctx)
    else localStorage.removeItem(KEY)
    setContextState(ctx)
  }

  return [context, setContext]
}
