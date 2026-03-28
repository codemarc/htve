const STORAGE_KEY = "htve_favorites"

function getStorage(): typeof chrome.storage.local | null {
  if (typeof chrome !== "undefined" && chrome.storage?.local) {
    return chrome.storage.local
  }
  return null
}

export async function getFavorites(): Promise<string[]> {
  const storage = getStorage()
  if (storage) {
    const result = await storage.get(STORAGE_KEY)
    return (result[STORAGE_KEY] as string[] | undefined) ?? []
  }
  // Fallback to localStorage for dev mode
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw ? JSON.parse(raw) : []
}

export async function toggleFavorite(channelName: string): Promise<string[]> {
  const favorites = await getFavorites()
  const index = favorites.indexOf(channelName)
  if (index >= 0) {
    favorites.splice(index, 1)
  } else {
    favorites.push(channelName)
  }

  const storage = getStorage()
  if (storage) {
    await storage.set({ [STORAGE_KEY]: favorites })
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  }

  return favorites
}
