import { readJSON, writeJSON } from '../lib/storage'
import { createStore } from './createStore'

const KEY = 'neythal.announce.dismissed.v1'
export const announceStore = createStore<boolean>(readJSON<boolean>(KEY, false, (v): v is boolean => typeof v === 'boolean'))
export const useAnnouncementVisible = () => !announceStore.use((s) => s)
export const dismissAnnouncements = () => {
  announceStore.set(true)
  writeJSON(KEY, true)
}
