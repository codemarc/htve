import type { Channel } from "../data/channels"

export type Platform = "ios" | "android" | "web"

interface FilterOptions {
  query: string
  platforms: Platform[]
  favorites: string[]
  showFavoritesFirst: boolean
}

export function filterChannels(channels: Channel[], options: FilterOptions): Channel[] {
  const { query, platforms, favorites, showFavoritesFirst } = options
  const lowerQuery = query.toLowerCase().trim()

  let filtered = channels.filter((ch) => {
    // Text search
    if (lowerQuery) {
      const matchesName = ch.name.toLowerCase().includes(lowerQuery)
      const matchesDesc = ch.description.toLowerCase().includes(lowerQuery)
      if (!matchesName && !matchesDesc) return false
    }

    // Platform filter
    if (platforms.length > 0) {
      const matchesPlatform = platforms.some((p) => ch.platforms[p])
      if (!matchesPlatform) return false
    }

    return true
  })

  // Sort: favorites first (if enabled), then alphabetical
  if (showFavoritesFirst) {
    const favSet = new Set(favorites)
    filtered.sort((a, b) => {
      const aFav = favSet.has(a.name) ? 0 : 1
      const bFav = favSet.has(b.name) ? 0 : 1
      if (aFav !== bFav) return aFav - bFav
      return a.name.localeCompare(b.name)
    })
  } else {
    filtered.sort((a, b) => a.name.localeCompare(b.name))
  }

  return filtered
}
