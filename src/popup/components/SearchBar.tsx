import { useEffect, useRef, useState } from "react"

interface SearchBarProps {
  onSearch: (query: string) => void
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [value, setValue] = useState("")
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => onSearch(value), 150)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [value, onSearch])

  return (
    <div className="search-bar">
      <span className="search-icon">&#128269;</span>
      <input
        type="text"
        placeholder="Search channels..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {value && (
        <button type="button" className="clear-btn" onClick={() => setValue("")}>
          &times;
        </button>
      )}
    </div>
  )
}
