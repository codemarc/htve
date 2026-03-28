import type { Channel } from "../../data/channels"

interface ChannelCardProps {
  channel: Channel
  isFavorite: boolean
  onToggleFavorite: (name: string) => void
}

export default function ChannelCard({ channel, isFavorite, onToggleFavorite }: ChannelCardProps) {
  const openChannel = () => {
    if (typeof chrome !== "undefined" && chrome.tabs?.create) {
      chrome.tabs.create({ url: channel.webUrl })
    } else {
      window.open(channel.webUrl, "_blank")
    }
  }

  return (
    <div className="channel-card" onClick={openChannel}>
      <div className="channel-info">
        <div className="channel-name">{channel.name}</div>
        <div className="channel-desc">{channel.description}</div>
        <div className="channel-platforms">
          {channel.platforms.ios && <span className="platform-dot ios" title="iOS">iOS</span>}
          {channel.platforms.android && <span className="platform-dot android" title="Android">And</span>}
          {channel.platforms.web && <span className="platform-dot web" title="Web">Web</span>}
        </div>
      </div>
      <button
        className={`fav-btn ${isFavorite ? "fav-active" : ""}`}
        onClick={(e) => {
          e.stopPropagation()
          onToggleFavorite(channel.name)
        }}
        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        {isFavorite ? "\u2605" : "\u2606"}
      </button>
    </div>
  )
}
