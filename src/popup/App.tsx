import { useCallback, useEffect, useState } from "react"
import { channels } from "../data/channels"
import { getFavorites, toggleFavorite } from "../utils/favorites"
import { filterChannels, type Platform } from "../utils/filter"
import ChannelList from "./components/ChannelList"
import PlatformFilter from "./components/PlatformFilter"
import SearchBar from "./components/SearchBar"

const CHROME_WEB_STORE_URL =
  "https://chromewebstore.google.com/detail/hotwire-tv-everywhere/obijbomlnicgdnanhfemmcecdcapaphk"

const extensionVersion: string | undefined =
  typeof chrome !== "undefined" && chrome.runtime?.getManifest
    ? chrome.runtime.getManifest().version
    : undefined

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
        <h1>
          Hotwire TV Everywhere
          {extensionVersion != null && extensionVersion !== "" ? (
            <>
              {" "}
              <a
                className="app-version"
                href={CHROME_WEB_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                ver {extensionVersion}
              </a>
            </>
          ) : null}
        </h1>
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
