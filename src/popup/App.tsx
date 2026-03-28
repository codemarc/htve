import { useCallback, useEffect, useState } from "react"
import { channels } from "../data/channels"
import { getFavorites, toggleFavorite } from "../utils/favorites"
import { filterChannels, type Platform } from "../utils/filter"
import SearchBar from "./components/SearchBar"
import PlatformFilter from "./components/PlatformFilter"
import ChannelList from "./components/ChannelList"

export default function App() {
  const [query, setQuery] = useState("")
  const [activePlatforms, setActivePlatforms] = useState<Platform[]>([])
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    getFavorites().then(setFavorites)
  }, [])

  const handleToggleFavorite = useCallback(async (name: string) => {
    const updated = await toggleFavorite(name)
    setFavorites(updated)
  }, [])

  const handleSearch = useCallback((q: string) => {
    setQuery(q)
  }, [])

  const filtered = filterChannels(channels, {
    query,
    platforms: activePlatforms,
    favorites,
    showFavoritesFirst: true,
  })

  return (
    <div className="app">
      <header className="app-header">
        <h1>Hotwire TV Everywhere</h1>
        <span className="channel-count">{filtered.length} channels</span>
      </header>
      <div className="controls">
        <SearchBar onSearch={handleSearch} />
        <PlatformFilter active={activePlatforms} onChange={setActivePlatforms} />
      </div>
      <ChannelList
        channels={filtered}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
      />
    </div>
  )
}
