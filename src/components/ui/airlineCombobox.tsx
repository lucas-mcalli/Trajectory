import * as React from "react"
import { Check, ChevronDown, X } from "lucide-react"
import { cn } from "~/lib/utils"
import { Field, FieldLabel } from "~/components/ui/field"
import type { AirlineComboboxProps } from "~/types"
import AIRLINES_DATA from "~/data/airlines.json"
import type { AirlineEntry } from "~/types"

const ALL_AIRLINES: AirlineEntry[] = AIRLINES_DATA as AirlineEntry[]

function getLogoUrl(domain: string): string {
  return `https://img.logo.dev/${domain}?token=pk_E9UJ86JlTC6zyB-Jpd9veQ`
}

function search(query: string): AirlineEntry[] {
  const q = query.toLowerCase().trim()
  if (!q) return []

  const exact: AirlineEntry[] = []
  const starts: AirlineEntry[] = []
  const contains: AirlineEntry[] = []

  for (const a of ALL_AIRLINES) {
    const icao = a.icao.toLowerCase()
    const name = a.name.toLowerCase()

    if (icao === q || name === q) { exact.push(a); continue }
    if (icao.startsWith(q) || name.startsWith(q)) { starts.push(a); continue }
    if (icao.includes(q) || name.includes(q)) contains.push(a)
  }

  return [...exact, ...starts, ...contains].slice(0, 8)
}

export default function AirlineCombobox({
  label,
  value,
  onChange,
  placeholder = "Search airline...",
  error,
  onOpen
}: AirlineComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const containerRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const results = React.useMemo(() => search(query), [query])
  const selected = React.useMemo(() => ALL_AIRLINES.find((a) => a.name === value), [value])

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

  function handleSelect(airline: AirlineEntry) {
    onChange(airline.name)
    setOpen(false)
    setQuery("")
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation()
    onChange("")
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
          onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 0); onOpen?.() }}
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
                src={getLogoUrl(selected.domain)}
                alt={selected.name}
                className="plasmo-size-4 plasmo-rounded-sm plasmo-object-contain plasmo-shrink-0"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
              />
            )}

            {open ? (
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={selected ? selected.name : placeholder}
                className="plasmo-flex-1 plasmo-bg-transparent plasmo-outline-none plasmo-text-sm plasmo-text-foreground placeholder:plasmo-text-muted-foreground"
                onKeyDown={(e) => {
                  if (e.key === "Escape") { setOpen(false); setQuery("") }
                  if (e.key === "Enter" && results.length > 0) handleSelect(results[0])
                }}
              />
            ) : (
              <span className={cn("plasmo-flex-1 plasmo-truncate plasmo-text-sm", !selected && "plasmo-text-muted-foreground")}>
                {selected ? selected.name : placeholder}
              </span>
            )}
          </div>

          <div className="plasmo-flex plasmo-items-center plasmo-gap-1 plasmo-ml-2">
            {selected && !open && (
              <button onClick={handleClear} className="plasmo-text-muted-foreground hover:plasmo-text-foreground plasmo-transition-colors">
                <X className="plasmo-size-3" />
              </button>
            )}
            <ChevronDown className="plasmo-size-4 plasmo-text-muted-foreground plasmo-shrink-0" />
          </div>
        </div>

        {open && (
          <div className={cn(
            "plasmo-absolute plasmo-z-50 plasmo-mt-1 plasmo-w-full",
            "plasmo-rounded-md plasmo-border plasmo-border-border plasmo-bg-background",
            "plasmo-shadow-md plasmo-overflow-hidden"
          )}>
            {results.length === 0 ? (
              <div className="plasmo-px-3 plasmo-py-4 plasmo-text-center plasmo-text-sm plasmo-text-muted-foreground">
                {query ? "No airlines found" : "Start typing to search"}
              </div>
            ) : (
              <ul className="plasmo-max-h-48 plasmo-overflow-y-auto plasmo-py-1">
                {results.map((airline) => (
                  <li
                    key={airline.icao}
                    onClick={() => handleSelect(airline)}
                    className={cn(
                      "plasmo-flex plasmo-items-center plasmo-justify-between",
                      "plasmo-px-3 plasmo-py-2 plasmo-cursor-pointer plasmo-text-sm",
                      "hover:plasmo-bg-accent hover:plasmo-text-accent-foreground",
                      "plasmo-transition-colors",
                      value === airline.name && "plasmo-bg-accent"
                    )}
                  >
                    <div className="plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-min-w-0">
                      <img
                        src={getLogoUrl(airline.domain)}
                        alt={airline.name}
                        className="plasmo-size-5 plasmo-rounded-sm plasmo-object-contain plasmo-shrink-0"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                      />
                      <span className="plasmo-font-medium plasmo-truncate">{airline.name}</span>
                    </div>

                    <div className="plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-ml-3 plasmo-shrink-0">
                      <span className="plasmo-text-xs plasmo-font-mono plasmo-font-semibold plasmo-text-primary">
                        {airline.icao}
                      </span>
                      {value === airline.name && (
                        <Check className="plasmo-size-3 plasmo-text-primary" />
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </Field>
  )
}