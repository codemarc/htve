import type { Platform } from "../../utils/filter"

interface PlatformFilterProps {
  active: Platform[]
  onChange: (platforms: Platform[]) => void
}

const PLATFORMS: { key: Platform; label: string }[] = [
  { key: "ios", label: "iOS" },
  { key: "android", label: "Android" },
  { key: "web", label: "Web" },
]

export default function PlatformFilter({ active, onChange }: PlatformFilterProps) {
  const toggle = (platform: Platform) => {
    if (active.includes(platform)) {
      onChange(active.filter((p) => p !== platform))
    } else {
      onChange([...active, platform])
    }
  }

  return (
			<div className="platform-filter">

      <button	type="button"		className="platform-btn"
					onClick={() => window.open("https://www.gethotwired.com/channel-lineup/tve", "_blank")}
				>TV Everywhere</button>
			<button type="button" className="platform-btn"
					onClick={() => window.open("https://braintrailz.com", "_blank")}
				>a braintrailz extension</button>
				<button
					type="button"
					className="platform-btn"
					onClick={() => window.open("https://codemarc.net", "_blank")}
				>
					from codemarc consulting
				</button>



				{/* {PLATFORMS.map(({ key, label }) => (
        <button
          key={key}
          className={`platform-btn ${active.includes(key) ? "active" : ""}`}
          onClick={() => toggle(key)}
        >
          {label}
        </button>
      ))} */}
			</div>
		);
}
