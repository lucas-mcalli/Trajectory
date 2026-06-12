import * as React from "react"
import { Check, ChevronDown, X } from "lucide-react"
import { cn } from "~/lib/utils"
import { Field, FieldLabel } from "~/components/ui/field"
import Regions from "~/data/regions.json"
import type { RegionComboboxProps, Region }  from "~types"

const REGIONS: Region[] = Regions as Region[]

function search(query: string): Region[] {
  const q = query.toLowerCase().trim()
  if (!q) return REGIONS
  return REGIONS.filter((r) => r.label.toLowerCase().includes(q))
}

export default function RegionCombobox({
  label,
  value,
  onChange,
  placeholder = "Select region...",
  error
}: RegionComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const containerRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const results = React.useMemo(() => search(query), [query])
  const selected = React.useMemo(() => REGIONS.find((r) => r.id === value), [value])

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

  function handleSelect(region: Region) {
    onChange(region.id)
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
        {error && <p className="plasmo-text-xs plasmo-text-destructive">{error}</p>}
      </div>

      <div ref={containerRef} className="plasmo-relative">
        <div
          onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 0) }}
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
            {open ? (
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={selected ? selected.label : placeholder}
                className="plasmo-flex-1 plasmo-bg-transparent plasmo-outline-none plasmo-text-sm plasmo-text-foreground placeholder:plasmo-text-muted-foreground"
                onKeyDown={(e) => {
                  if (e.key === "Escape") { setOpen(false); setQuery("") }
                  if (e.key === "Enter" && results.length > 0) handleSelect(results[0])
                }}
              />
            ) : (
              <span className={cn("plasmo-flex-1 plasmo-truncate plasmo-text-sm", !selected && "plasmo-text-muted-foreground")}>
                {selected ? selected.label : placeholder}
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
            <ul className="plasmo-max-h-48 plasmo-overflow-y-auto plasmo-py-1">
              {results.length === 0 ? (
                <li className="plasmo-px-3 plasmo-py-4 plasmo-text-center plasmo-text-sm plasmo-text-muted-foreground">
                  No regions found
                </li>
              ) : results.map((region) => (
                <li
                  key={region.id}
                  onClick={() => handleSelect(region)}
                  className={cn(
                    "plasmo-flex plasmo-items-center plasmo-justify-between",
                    "plasmo-px-3 plasmo-py-2 plasmo-cursor-pointer plasmo-text-sm",
                    "hover:plasmo-bg-accent hover:plasmo-text-accent-foreground",
                    "plasmo-transition-colors",
                    value === region.id && "plasmo-bg-accent"
                  )}
                >
                  <span className="plasmo-truncate">{region.label}</span>
                  {value === region.id && <Check className="plasmo-size-3 plasmo-text-primary plasmo-shrink-0" />}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Field>
  )
}