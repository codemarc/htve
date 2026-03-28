import type { Channel } from "../../data/channels"
import ChannelCard from "./ChannelCard"

interface ChannelListProps {
  channels: Channel[]
  favorites: string[]
  onToggleFavorite: (name: string) => void
}

export default function ChannelList({ channels, favorites, onToggleFavorite }: ChannelListProps) {
  if (channels.length === 0) {
    return <div className="empty-state">No channels found</div>
  }

  const favSet = new Set(favorites)

  return (
    <div className="channel-list">
      {channels.map((ch) => (
        <ChannelCard
          key={ch.name}
          channel={ch}
          isFavorite={favSet.has(ch.name)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  )
}
