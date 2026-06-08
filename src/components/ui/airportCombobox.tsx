import * as React from "react"
import { Check, ChevronDown, X } from "lucide-react"
// @ts-ignore
import airports from "airport-codes"

import { cn } from "~/lib/utils"
import { Field, FieldLabel } from "~/components/ui/field"
import type { AirportComboboxProps, Airport } from "~/types"


const ALL_AIRPORTS: Airport[] = (airports.toJSON() as any[])
  .filter((a) => a.iata && a.iata.length === 3 && a.name)
  .map((a) => ({
    iata: a.iata.toUpperCase(),
    name: a.name,
    city: a.city || "",
    country: a.country || "",
  }))

function search(query: string): Airport[] {
  const q = query.toLowerCase().trim()
  if (!q) return []

  const exact: Airport[] = []
  const starts: Airport[] = []
  const contains: Airport[] = []

  for (const a of ALL_AIRPORTS) {
    const iata = a.iata.toLowerCase()
    const name = a.name.toLowerCase()
    const city = a.city.toLowerCase()

    if (iata === q) { exact.push(a); continue }
    if (iata.startsWith(q) || city.startsWith(q)) { starts.push(a); continue }
    if (iata.includes(q) || name.includes(q) || city.includes(q)) contains.push(a)
  }

  return [...exact, ...starts, ...contains].slice(0, 8)
}


export default function AirportCombobox({
  label,
  value,
  onChange,
  placeholder = "Search airport...",
  error,
  onOpen
}: AirportComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const containerRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const results = React.useMemo(() => search(query), [query])

  const selected = React.useMemo(
    () => ALL_AIRPORTS.find((a) => a.iata === value),
    [value]
  )

  // Close on outside click
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

  function handleSelect(airport: Airport) {
    onChange(airport.iata)
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
      <div ref={containerRef} className="plasmo-relative plasmo-flex-1 plasmo-min-w-0">
        {/* Trigger */}
        <div
          onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 0); onOpen?.() }}
          className={cn(
            "plasmo-flex plasmo-h-9 plasmo-w-full plasmo-min-w-0 plasmo-items-center plasmo-justify-between",
            "plasmo-rounded-md plasmo-border plasmo-border-input plasmo-bg-background",
            "plasmo-px-3 plasmo-py-2 plasmo-text-sm plasmo-cursor-pointer",
            "plasmo-transition-all plasmo-ease-out plasmo-duration-100",
            open && "plasmo-border-ring plasmo-ring-2 plasmo-ring-ring",
            error && "plasmo-ring-2 plasmo-ring-destructive"
          )}
        >
          {open ? (
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={selected ? `${selected.iata}` : placeholder}
              className="plasmo-flex-1p plasmo-min-w-0 plasmo-bg-transparent plasmo-outline-none plasmo-text-sm plasmo-text-foreground placeholder:plasmo-text-muted-foreground"
              onKeyDown={(e) => {
                if (e.key === "Escape") { setOpen(false); setQuery("") }
                if (e.key === "Enter" && results.length > 0) handleSelect(results[0])
              }}
            />
          ) : (
            <span className={cn("plasmo-flex-1 plasmo-truncate", !selected && "plasmo-text-muted-foreground")}>
              {selected ? `${selected.iata}` : placeholder}
            </span>
          )}

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

        {/* Dropdown */}
        {open && (
          <div className={cn(
            "plasmo-absolute plasmo-z-50 plasmo-mt-1 plasmo-w-full plasmo-min-w-0",
            "plasmo-rounded-md plasmo-border plasmo-border-border plasmo-bg-background",
            "plasmo-shadow-md plasmo-overflow-hidden"
          )}>
            {results.length === 0 ? (
              <div className="plasmo-px-3 plasmo-py-4 plasmo-text-center plasmo-text-sm plasmo-text-muted-foreground">
                {query ? "No airports found" : "Start typing to search"}
              </div>
            ) : (
              <ul className="plasmo-max-h-48 plasmo-overflow-y-auto plasmo-py-1">
                {results.map((airport) => (
                  <li
                    key={airport.iata}
                    onClick={() => handleSelect(airport)}
                    className={cn(
                      "plasmo-flex plasmo-items-center plasmo-justify-between",
                      "plasmo-px-3 plasmo-py-2 plasmo-cursor-pointer plasmo-text-sm",
                      "hover:plasmo-bg-accent hover:plasmo-text-accent-foreground",
                      "plasmo-transition-colors",
                      value === airport.iata && "plasmo-bg-accent"
                    )}
                  >
                    <div className="plasmo-flex plasmo-flex-col plasmo-min-w-0">
                      <span className="plasmo-font-medium plasmo-truncate">
                        {airport.city || airport.name}
                      </span>
                      <span className="plasmo-text-xs plasmo-text-muted-foreground plasmo-truncate">
                        {airport.name}
                      </span>
                    </div>
                    <div className="plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-ml-3 plasmo-shrink-0">
                      <span className="plasmo-text-xs plasmo-font-mono plasmo-font-semibold plasmo-text-primary">
                        {airport.iata}
                      </span>
                      {value === airport.iata && (
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