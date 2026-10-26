import { useSyncExternalStore } from 'react'

export function createStore<T>(initial: T) {
  let state = initial
  const listeners = new Set<() => void>()
  const get = () => state
  const set = (next: T | ((s: T) => T)) => {
    const value = typeof next === 'function' ? (next as (s: T) => T)(state) : next
    if (Object.is(value, state)) return
    state = value
    listeners.forEach((l) => l())
  }
  const subscribe = (l: () => void) => {
    listeners.add(l)
    return () => listeners.delete(l)
  }
  /** Selectors must return stable references (a field of state, not a fresh object). */
  const use = <S,>(selector: (s: T) => S) => useSyncExternalStore(subscribe, () => selector(state), () => selector(state))
  return { get, set, subscribe, use }
}
