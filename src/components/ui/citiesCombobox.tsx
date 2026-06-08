import * as React from "react"
import { Check, ChevronDown, X } from "lucide-react"
import { cn } from "~/lib/utils"
import { Field, FieldLabel } from "~/components/ui/field"
import type { CitiesComboboxProps, LocationEntry } from "~/types"
import LOCATIONS_DATA from "~/data/cities.json"

const ALL_LOCATIONS: LocationEntry[] = LOCATIONS_DATA as LocationEntry[]

function search(query: string): LocationEntry[] {
  const q = query.toLowerCase().trim()
  if (!q) return []

  const exact: LocationEntry[] = []
  const starts: LocationEntry[] = []
  const contains: LocationEntry[] = []

  for (const loc of ALL_LOCATIONS) {
    const city = loc.city.toLowerCase()
    const country = loc.country.toLowerCase()
    const combined = `${city}, ${country}`

    // Tier 1: Exact matches
    if (city === q || combined === q) {
      exact.push(loc)
      continue
    }
    // Tier 2: Search starts with query phrase
    if (city.startsWith(q) || country.startsWith(q)) {
      starts.push(loc)
      continue
    }
    // Tier 3: Loose substring match anywhere inside text
    if (city.includes(q) || country.includes(q)) {
      contains.push(loc)
    }
  }

  // Combine arrays preserving priority order, capping out-of-view memory at 12 records
  return [...exact, ...starts, ...contains].slice(0, 12)
}

export default function CitiesCombobox({
  label,
  value,
  onChange,
  placeholder = "Search city",
  error,
  onOpen
}: CitiesComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const containerRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const results = React.useMemo(() => search(query), [query])
  
  // Track selected instance using a robust combined unique string identity key
  const selected = React.useMemo(() => {
    return ALL_LOCATIONS.find((loc) => `${loc.city}, ${loc.country}` === value)
  }, [value])

  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery("")
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  function handleSelect(location: LocationEntry) {
    // Passes identity compound key back up to form state listeners
    onChange(location)
    setOpen(false)
    setQuery("")
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation()
    onChange(null)
    setQuery("")
    inputRef.current?.focus()
  }

  return (
    <Field className="plasmo-w-full plasmo-flex plasmo-flex-col">
      <div className="plasmo-flex plasmo-justify-between plasmo-items-end">
        <FieldLabel>{label}</FieldLabel>
        {error && (
          <p className="plasmo-text-xs plasmo-text-destructive">{error}</p>
        )}
      </div>

      <div ref={containerRef} className="plasmo-relative">
        <div
          onClick={() => {
            setOpen(true)
            setTimeout(() => inputRef.current?.focus(), 0)
            onOpen?.()
          }}
          className={cn(
            "plasmo-flex plasmo-h-9 plasmo-w-full plasmo-items-center plasmo-justify-between",
            "plasmo-rounded-md plasmo-border plasmo-border-input plasmo-bg-background",
            "plasmo-px-3 plasmo-py-2 plasmo-text-sm plasmo-cursor-pointer",
            "plasmo-transition-all plasmo-duration-100 plasmo-ease-out",
            open && "plasmo-border-ring plasmo-ring-2 plasmo-ring-ring",
            error && "plasmo-ring-2 plasmo-ring-destructive"
          )}
        >
          <div className="plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-flex-1 plasmo-min-w-0">
            {selected && !open && (
              <img
                src={selected.flag}
                alt={`${selected.country} Flag`}
                className="plasmo-size-4 plasmo-rounded-sm plasmo-object-cover plasmo-shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none"
                }}
              />
            )}

            {open ? (
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={selected ? `${selected.city}, ${selected.country}` : placeholder}
                className="plasmo-flex-1 plasmo-bg-transparent plasmo-outline-none plasmo-text-sm plasmo-text-foreground placeholder:plasmo-text-muted-foreground"
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setOpen(false)
                    setQuery("")
                  }
                  if (e.key === "Enter" && results.length > 0) {
                    handleSelect(results[0])
                  }
                }}
              />
            ) : (
              <span
                className={cn(
                  "plasmo-flex-1 plasmo-truncate plasmo-text-sm",
                  !selected && "plasmo-text-muted-foreground"
                )}
              >
                {selected ? `${selected.city}, ${selected.country}` : placeholder}
              </span>
            )}
          </div>

          <div className="plasmo-flex plasmo-items-center plasmo-gap-1 plasmo-ml-2">
            {selected && !open && (
              <button
                onClick={handleClear}
                className="plasmo-text-muted-foreground hover:plasmo-text-foreground plasmo-transition-colors"
              >
                <X className="plasmo-size-3" />
              </button>
            )}
            <ChevronDown className="plasmo-size-4 plasmo-text-muted-foreground plasmo-shrink-0" />
          </div>
        </div>

        {open && (
          <div
            className={cn(
              "plasmo-absolute plasmo-z-50 plasmo-mt-1 plasmo-w-full",
              "plasmo-rounded-md plasmo-border plasmo-border-border plasmo-bg-background",
              "plasmo-shadow-md plasmo-overflow-hidden"
            )}
          >
            {results.length === 0 ? (
              <div className="plasmo-px-3 plasmo-py-4 plasmo-text-center plasmo-text-sm plasmo-text-muted-foreground">
                {query ? "No destinations found" : "Start typing city name..."}
              </div>
            ) : (
              <ul className="plasmo-max-h-60 plasmo-overflow-y-auto plasmo-py-1">
                {results.map((location) => {
                  const locationKey = `${location.city}, ${location.country}`
                  const isSelected = value === locationKey

                  return (
                    <li
                      key={locationKey}
                      onClick={() => handleSelect(location)}
                      className={cn(
                        "plasmo-flex plasmo-items-center plasmo-justify-between",
                        "plasmo-px-3 plasmo-py-2 plasmo-cursor-pointer plasmo-text-sm",
                        "hover:plasmo-bg-accent hover:plasmo-text-accent-foreground",
                        "plasmo-transition-colors",
                        isSelected && "plasmo-bg-accent"
                      )}
                    >
                      <div className="plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-min-w-0">
                        <img
                          src={location.flag}
                          alt=""
                          className="plasmo-size-4 plasmo-rounded-sm plasmo-object-cover plasmo-shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none"
                          }}
                        />
                        <span className="plasmo-font-medium plasmo-truncate">
                          {location.city}
                        </span>
                        <span className="plasmo-text-xs plasmo-text-muted-foreground plasmo-truncate">
                          ({location.country})
                        </span>
                      </div>

                      {isSelected && (
                        <div className="plasmo-flex plasmo-items-center plasmo-ml-3 plasmo-shrink-0">
                          <Check className="plasmo-size-3 plasmo-text-primary" />
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        )}
      </div>
    </Field>
  )
}